// Discord
import { Message } from 'discord.js';
// TempleOSRS Cache
import { fetchTemple, playerRecords } from '../../cache/templeCache';
// Cooldown cache
import { isOnCooldown } from '../../cache/cooldown';
// UTILS: Embeds
import {
  TempleEmbed,
  EmbedTitles,
  usernameString,
  ErrorEmbed,
  Embed,
} from '../../utils/embed';
// UTILS: Interfaces
import {
  TemplePlayerRecords,
  PlayerRecordsTimes,
  ExpAndDate,
} from '../../utils/osrs/interfaces';
// UTILS: Enums
import {
  TempleOther,
  TempleCacheType,
  OsrsRandom,
  ValidInputCases,
  CommandCooldowns,
  OsrsCommands,
} from '../../utils/osrs/enums';
// UTILS: Runescape name validator
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Input validator
import {
  templeGainsRecords,
  fieldNameCheck,
} from '../../utils/osrs/inputValidator';
// UTILS: Capitalize first letter
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';
// UTILS: FIeld name formatter
import { fieldNameFormatter } from '../../utils/osrs/fieldNameFormatter';
// UTILS : Number formatter
import {
  numberFormatter,
  NumberFormatTypes,
} from '../../utils/numberFormatter';
// Anti-spam
import { antiSpam } from '../../cache/antiSpam';

export const record = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined | ErrorEmbed> => {
  if (antiSpam(msg, commandName) === true) return;
  if (args.length === 0)
    return msg.channel.send(
      new Embed().setDescription(
        `**Please provide arguments. Valid formats**:\`\`\`.${OsrsCommands.RECORD} clues tier time username\n\n.${OsrsCommands.RECORD} other ehb/ehp/lms time username\n\n.${OsrsCommands.RECORD} skill skill-name time username\n\n.${OsrsCommands.RECORD} boss boss-name time username\`\`\``
      )
    );
  // This is done so the cooldown is per unique command e.g if someone checks weekly record then wants to check monthly record then it won't give them a cooldown
  const lowerCasedArguments: string[] = args.map((e: string) => {
    return e.toLowerCase();
  });
  // Validate user input and returns an object
  const parsedInput:
    | {
        rsn: string[] | undefined;
        time: string | undefined;
        field: string | undefined;
        case: string | undefined;
      }
    | undefined = templeGainsRecords(msg, args, commandName);
  if (parsedInput === undefined) return;
  const cooldown: number = CommandCooldowns.RECORD;
  if (
    parsedInput.rsn !== undefined &&
    parsedInput.time !== undefined &&
    parsedInput.field !== undefined &&
    parsedInput.case !== undefined
  ) {
    // Check if rsn is valid runescape name
    const nameCheck: string | undefined = runescapeNameValidator(
      parsedInput.rsn
    );
    if (nameCheck === undefined) return msg.channel.send(invalidUsername);
    const username: string = nameCheck;
    // Check if command is on cooldown
    if (
      isOnCooldown(
        msg,
        commandName,
        cooldown,
        false,
        lowerCasedArguments.join('')
      ) === true
    )
      return;
    // Because there are multiple time options, I want to have separate keys for each option, so instead of passing username I'm passing username + time so the key name becomes "zezimaweek" instead of just "zezima"
    const userNameWithTime: string = username + parsedInput.time;
    const embed: TempleEmbed = new TempleEmbed()
      .setTitle(EmbedTitles.RECORDS)
      .addField(usernameString, `\`\`\`${username}\`\`\``);
    // Check if item is in cache
    if (userNameWithTime in playerRecords) {
      // Try to match the input field with key name on player object
      const field: keyof TemplePlayerRecords | undefined = fieldNameCheck(
        parsedInput.field,
        parsedInput.case
      ) as keyof TemplePlayerRecords;
      if (field === undefined) return errorHandler();
      // Generate embed
      else {
        const result: TempleEmbed = generateResult(
          field,
          embed,
          playerRecords[userNameWithTime],
          parsedInput.time as keyof PlayerRecordsTimes,
          lowerCasedArguments
        );
        return msg.channel.send(result);
      }
    } else {
      const dataType: TempleCacheType = TempleCacheType.PLAYER_RECORDS;
      // Fetch data from API endpoint
      const isFetched: boolean = await fetchTemple(
        msg,
        username,
        dataType,
        parsedInput.time
      );
      if (isFetched === true) {
        // Try to match the input field with key name on player object
        const field: keyof TemplePlayerRecords | undefined = fieldNameCheck(
          parsedInput.field,
          parsedInput.case
        ) as keyof TemplePlayerRecords;
        if (field === undefined) return errorHandler();
        else {
          // Generate result
          const result: TempleEmbed = generateResult(
            field,
            embed,
            playerRecords[userNameWithTime],
            parsedInput.time as keyof PlayerRecordsTimes,
            lowerCasedArguments
          );

          return msg.channel.send(result);
        }
      } else return;
    }
  }
};
// Generates embed sent to user
const generateResult = (
  field: keyof TemplePlayerRecords,
  embed: TempleEmbed,
  playerObject: TemplePlayerRecords,
  time: keyof PlayerRecordsTimes,
  args: string[]
): TempleEmbed | ErrorEmbed => {
  if (playerObject === undefined || playerObject === null)
    return errorHandler();
  else {
    // Changing the time value (string) to have a first capital letter
    const capitalFirst: string = capitalizeFirstLetter(time);
    const formattedField: string = fieldNameFormatter(field);
    // If there are no records the key value is an empty array
    if (Array.isArray(playerObject[field]) === false) {
      // If there's no record for specific period of time then the key doesn't exist
      if (playerObject[field] !== undefined) {
        embed.addField(
          `${OsrsRandom.TIME_PERIOD}:`,
          `\`\`\`${capitalFirst}\`\`\``
        );
        if (playerObject[field][time] === undefined)
          return embed.addField(
            `${OsrsRandom.NO_DATA}`,
            `No records for this period of time for \`\`\`${formattedField}\`\`\``
          );
        // Formatting how numbers are displayed
        const timeField: ExpAndDate = playerObject[field][time] as ExpAndDate;
        const value: string | number = timeField[TempleOther.XP];
        let formattedValue;
        if (value === null) formattedValue = 0;
        if (args[0] === ValidInputCases.SKILL)
          formattedValue = numberFormatter(
            value as number,
            NumberFormatTypes.EN_US
          );
        else
          formattedValue = numberFormatter(
            value as number,
            NumberFormatTypes.INT
          );

        // Changing sufix depending on whether the type is skill or not
        let ending: string;
        if (args[0] === ValidInputCases.SKILL) ending = ` ${TempleOther.XP}`;
        else if (args[0] === ValidInputCases.BOSS)
          ending = ` ${OsrsRandom.KILLS}`;
        else ending = '';
        // Formatting date
        const formattedDate: string = numberFormatter(
          playerObject[field][time][TempleOther.DATE_LOWERCASE],
          NumberFormatTypes.EN_GB
        ) as string;

        embed.addField(
          `${formattedField}`,
          `\`\`\`${formattedValue}${ending}\`\`\``
        );
        embed.addField('RECORD SET ON:', `\`\`\`${formattedDate}\`\`\``);
      } else {
        embed.addField(
          `${OsrsRandom.NO_DATA}`,
          `No records for this period of time for \`\`\`${formattedField}\`\`\``
        );
      }
    } else {
      embed.addField(
        `${OsrsRandom.NO_DATA}`,
        `No records for \`\`\`${formattedField}\`\`\``
      );
    }
    return embed;
  }
};
