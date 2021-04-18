// Discord
import { Message } from 'discord.js';
// TempleOSRS Cache
import {
  fetchTemple,
  playerOverviewOther,
  playerOverviewSkill,
} from '../../cache/templeCache';
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
  TempleOverviewSkill,
  TempleOverviewOther,
  TempleTableSkill,
  TempleTableOther,
} from '../../utils/osrs/interfaces';
// UTILS: Enums
import {
  TempleOther,
  Clues,
  Skills,
  PlayerOverviewTimesAliases,
  PlayerOverviewTimes,
  TempleCacheType,
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
  ValidCases,
} from '../../utils/osrs/inputValidator';
// UTILS: Capitalize first letter
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

export const gains = async (
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

  let playerCache;
  let dataType: TempleCacheType;
  if (parsedInput === undefined) return;
  else if (
    parsedInput.case === ValidCases.BOSS ||
    parsedInput.case === ValidCases.CLUES
  ) {
    playerCache = playerOverviewOther;
    dataType = TempleCacheType.PLAYER_OVERVIEW_OTHER;
  } else if (parsedInput.case === ValidCases.OTHER) {
    if (
      parsedInput.field === TempleOther.EHB_LOWERCASE ||
      parsedInput.field === TempleOther.LMS_LOWERCASE
    ) {
      playerCache = playerOverviewOther;
      dataType = TempleCacheType.PLAYER_OVERVIEW_OTHER;
    } else {
      playerCache = playerOverviewSkill;
      dataType = TempleCacheType.PLAYER_OVERVIEW_SKILL;
    }
  } else {
    (playerCache = playerOverviewSkill),
      (dataType = TempleCacheType.PLAYER_OVERVIEW_SKILL);
  }
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
    if (username + parsedInput.time in playerCache) {
      const field: keyof TempleTableOther = fieldNameCheck(
        parsedInput.field,
        parsedInput.case
      ) as keyof TempleTableOther;
      if (field === undefined) return;
      else {
        const result: TempleEmbed = generateResult(
          field,
          embed,
          playerCache[username + parsedInput.time],
          parsedInput.time,
          lowerCasedArguments
        );
        return msg.channel.send(result);
      }
    } else {
      // Changing time aliases
      let timePeriod: string;
      switch (parsedInput.time) {
        case PlayerOverviewTimesAliases.FIVEMIN:
          timePeriod = PlayerOverviewTimes.FIVEMIN;
          break;
        case PlayerOverviewTimesAliases.DAY:
          timePeriod = PlayerOverviewTimes.DAY;
          break;
        case PlayerOverviewTimesAliases.WEEK:
          timePeriod = PlayerOverviewTimes.WEEK;
          break;
        case PlayerOverviewTimesAliases.MONTH:
          timePeriod = PlayerOverviewTimes.MONTH;
          break;
        case PlayerOverviewTimesAliases.HALFYEAR:
          timePeriod = PlayerOverviewTimes.HALFYEAR;
          break;
        case PlayerOverviewTimesAliases.YEAR:
          timePeriod = PlayerOverviewTimes.YEAR;
          break;
        default:
          timePeriod = parsedInput.time;
          break;
      }
      const isFetched: boolean = await fetchTemple(
        msg,
        username,
        dataType,
        timePeriod
      );
      if (isFetched === true) {
        const field:
          | keyof TempleTableOther
          | keyof TempleTableSkill = fieldNameCheck(
          parsedInput.field,
          parsedInput.case
        ) as keyof TempleTableOther | keyof TempleTableSkill;
        if (field === undefined) return;
        else {
          const result: TempleEmbed = generateResult(
            field,
            embed,
            playerCache[username + timePeriod],
            parsedInput.time,
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
  field: keyof TempleTableOther | keyof TempleTableSkill,
  embed: TempleEmbed,
  playerObject: TempleOverviewSkill | TempleOverviewOther,
  time: string,
  args: string[]
): TempleEmbed | ErrorEmbed => {
  if (playerObject === undefined) return new ErrorEmbed();
  else {
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
      case TempleOther.IM_EHP:
        formattedField = 'Ironman EHP';
        break;

      default:
        formattedField = field;
        break;
    }
    console.log(playerObject);
    const table: TempleTableOther | TempleTableSkill =
      playerObject[TempleOther.TABLE];

    // If there are no records the key value is an empty array

    // If there's no record for specific period of time then the key doesn't exist
    if (table[field] !== undefined) {
      // Formatting how numbers are displayed
      const value: string | number = table[field][TempleOther.XP];
      let formattedValue;

      if (args[0] === 'other') formattedValue = value;
      else {
        const formatter: Intl.NumberFormat = new Intl.NumberFormat('en-US');
        formattedValue = formatter.format(value as number);
      }
      // Changing sufix depending on whether the type is skill or not
      let ending: string;
      if (args[0] === 'skill') ending = ' xp';
      else ending = '';

      embed.addField('Time Period', `${capitalFirst}`);
      embed.addField(`${formattedField}`, `${formattedValue}${ending}`);
    } else {
      embed.addField(`Time Period`, `${capitalFirst}`);
      embed.addField(
        `NO DATA`,
        `No gains for this period of time for \`\`\`${formattedField}\`\`\``
      );
    }
    return embed;
  }
};
