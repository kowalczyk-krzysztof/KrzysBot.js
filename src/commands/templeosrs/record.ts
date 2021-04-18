import { Message } from 'discord.js';
import { TempleOther, Clues, Skills } from '../../utils/osrs/enums';
import {
  TempleEmbed,
  EmbedTitles,
  usernameString,
  ErrorEmbed,
} from '../../utils/embed';
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
import { isOnCooldown } from '../../cache/cooldown';
import {
  fetchTemple,
  CacheTypes,
  playerRecords,
  PlayerRecords,
} from '../../cache/templeCache';

import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

import {
  templeGainsRecords,
  fieldNameCheck,
} from '../../utils/osrs/templeGainsRecords';

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
      const field: string | undefined = fieldNameCheck(
        parsedInput.field,
        parsedInput.case
      );
      if (field === undefined) return;
      const result: TempleEmbed = generateResult(
        field,
        embed,
        playerRecords[username],
        parsedInput.time,
        lowerCasedArguments
      );
      return msg.channel.send(result);
    } else {
      const dataType: CacheTypes = CacheTypes.PLAYER_RECORDS;
      const isFetched: boolean = await fetchTemple(msg, username, dataType);
      if (isFetched === true) {
        const field: string | undefined = fieldNameCheck(
          parsedInput.field,
          parsedInput.case
        );
        if (field === undefined) return;
        const result: TempleEmbed = generateResult(
          field,
          embed,
          playerRecords[username],
          parsedInput.time,
          lowerCasedArguments
        );

        return msg.channel.send(result);
      } else return;
    }
  }
};

// Generates embed sent to user
const generateResult = (
  field: string,
  embed: TempleEmbed,
  playerObject: PlayerRecords,
  time: string,
  args: string[]
): TempleEmbed | ErrorEmbed => {
  if (playerObject === undefined) return new ErrorEmbed();
  // Changing the time value (string) to have a first capital letter
  const capitalFirst: string = capitalizeFirstLetter(time);
  let formattedField: string;
  switch (field) {
    case Clues.ALL:
      formattedField = 'All Clues';
      break;
    case Clues.BEGINNER:
      formattedField = 'Beginner Clues';
      break;
    case Clues.EASY:
      formattedField = 'Easy Clues';
      break;
    case Clues.MEDIUM:
      formattedField = 'Medium Clues';
      break;
    case Clues.HARD:
      formattedField = 'Hard Clues';
      break;
    case Clues.ELITE:
      formattedField = 'Hard Clues';
      break;
    case Clues.MASTER:
      formattedField = 'Master Clues';
      break;
    case Skills.RC:
      formattedField = 'Runecrating';
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
      const value: string | number = playerObject[field][time][TempleOther.XP];
      let formattedValue;

      if (args[0] === 'other') formattedValue = parseInt(value as string);
      else {
        const formatter: Intl.NumberFormat = new Intl.NumberFormat('en-US');
        formattedValue = formatter.format(value as number);
      }
      // Changing sufix depending on whether the type is skill or not
      let ending: string;
      if (args[0] === 'skill') ending = ' xp';
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
};
