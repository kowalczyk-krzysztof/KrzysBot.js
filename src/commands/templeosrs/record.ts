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
  Clues,
  Skills,
  TempleCacheType,
  ClueNamesFormatted,
  OsrsRandom,
} from '../../utils/osrs/enums';
// UTILS: Runescape name validator
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Input validator
import {
  templeGainsRecords,
  fieldNameCheck,
} from '../../utils/osrs/inputValidator';
// UTILS: Capitalize first letter
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

export const record = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const lowerCasedArguments = args.map((e: string) => {
    return e.toLowerCase();
  });
  const parsedInput:
    | {
        rsn: string[] | undefined;
        time: string | undefined;
        field: string | undefined;
        case: string | undefined;
      }
    | undefined = templeGainsRecords(msg, args, commandName);
  if (parsedInput === undefined) return;
  const cooldown: number = 30;
  if (
    parsedInput.rsn !== undefined &&
    parsedInput.time !== undefined &&
    parsedInput.field !== undefined &&
    parsedInput.case !== undefined
  ) {
    const nameCheck: string = runescapeNameValidator(parsedInput.rsn);
    if (nameCheck === invalidRSN) return msg.channel.send(invalidUsername);
    const username: string = nameCheck;
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
    const embed: TempleEmbed = new TempleEmbed()
      .setTitle(EmbedTitles.RECORDS)
      .addField(usernameString, `${username}`);
    if (username in playerRecords) {
      const field: keyof TemplePlayerRecords | undefined = fieldNameCheck(
        parsedInput.field,
        parsedInput.case
      ) as keyof TemplePlayerRecords;
      if (field === undefined) return;
      else {
        const result: TempleEmbed = generateResult(
          field,
          embed,
          playerRecords[username],
          parsedInput.time as keyof PlayerRecordsTimes,
          lowerCasedArguments
        );
        return msg.channel.send(result);
      }
    } else {
      const dataType: TempleCacheType = TempleCacheType.PLAYER_RECORDS;
      const isFetched: boolean = await fetchTemple(msg, username, dataType);
      if (isFetched === true) {
        const field: keyof TemplePlayerRecords | undefined = fieldNameCheck(
          parsedInput.field,
          parsedInput.case
        ) as keyof TemplePlayerRecords;
        if (field === undefined) return;
        else {
          const result: TempleEmbed = generateResult(
            field,
            embed,
            playerRecords[username],
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
  if (playerObject === undefined) return new ErrorEmbed();
  else {
    // Changing the time value (string) to have a first capital letter
    const capitalFirst: string = capitalizeFirstLetter(time);
    let formattedField: string;
    switch (field) {
      case Clues.ALL:
        formattedField = ClueNamesFormatted.ALL;
        break;
      case Clues.BEGINNER:
        formattedField = ClueNamesFormatted.BEGINNER;
        break;
      case Clues.EASY:
        formattedField = ClueNamesFormatted.EASY;
        break;
      case Clues.MEDIUM:
        formattedField = ClueNamesFormatted.MEDIUM;
        break;
      case Clues.HARD:
        formattedField = ClueNamesFormatted.HARD;
        break;
      case Clues.ELITE:
        formattedField = ClueNamesFormatted.ELITE;
        break;
      case Clues.MASTER:
        formattedField = ClueNamesFormatted.MASTER;
        break;
      case Skills.RC:
        formattedField = OsrsRandom.RUNECRAFTING;
        break;
      case TempleOther.EHB:
        formattedField = field.toUpperCase();
        break;
      case TempleOther.EHP:
        formattedField = field.toUpperCase();
        break;
      default:
        formattedField = field;
        break;
    }
    // If there are no records the key value is an empty array
    if (Array.isArray(playerObject[field]) === false) {
      // If there's no record for specific period of time then the key doesn't exist
      if (playerObject[field][time] !== undefined) {
        // Formatting how numbers are displayed
        const timeField: ExpAndDate = playerObject[field][time] as ExpAndDate;
        const value: string | number = timeField[TempleOther.XP];
        let formattedValue;
        if (args[0] === 'other') formattedValue = parseInt(value as string);
        else {
          const formatter: Intl.NumberFormat = new Intl.NumberFormat(
            `${OsrsRandom.DATE_FORMAT}`
          );
          formattedValue = formatter.format(value as number);
        }
        // Changing sufix depending on whether the type is skill or not
        let ending: string;
        if (args[0] === 'skill') ending = ` ${TempleOther.XP}`;
        else ending = '';
        // Formatting date
        const stringToDate: Date = new Date(
          playerObject[field][time][TempleOther.DATE_LOWERCASE]
        );

        const formattedDate: string = new Intl.DateTimeFormat('en-GB').format(
          stringToDate
        );
        embed.addField('Time Period', `${capitalFirst}`);
        embed.addField(`${formattedField}`, `${formattedValue}${ending}`);
        embed.addField('Record set on:', `${formattedDate}`);
      } else {
        embed.addField(`Time Period`, `${capitalFirst}`);
        embed.addField(
          `NO DATA`,
          `No records for this period of time for \`\`\`${formattedField}\`\`\``
        );
      }
    } else {
      embed.addField(`NO DATA`, `No records for \`\`\`${formattedField}\`\`\``);
    }
    return embed;
  }
};
