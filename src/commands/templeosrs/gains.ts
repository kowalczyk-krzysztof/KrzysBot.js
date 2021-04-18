import { Message } from 'discord.js';
import {
  TempleOther,
  Clues,
  Skills,
  PlayerOverviewTimesAliases,
  PlayerOverviewTimes,
} from '../../utils/osrs/enums';
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
  playerOverviewOther,
  PlayerOverviewSkill,
  PlayerOverviewOther,
  playerOverviewSkill,
} from '../../cache/templeCache';

import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

import {
  templeGainsRecords,
  fieldNameCheck,
  ValidCases,
} from '../../utils/osrs/templeGainsRecords';

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
  let dataType: CacheTypes;
  if (parsedInput === undefined) return;
  if (
    parsedInput.case === ValidCases.BOSS ||
    parsedInput.case === ValidCases.CLUES
  ) {
    playerCache = playerOverviewOther;
    dataType = CacheTypes.PLAYER_OVERVIEW_OTHER;
  } else if (parsedInput.case === ValidCases.OTHER) {
    if (
      parsedInput.field === TempleOther.EHB_LOWERCASE ||
      parsedInput.field === TempleOther.LMS_LOWERCASE
    ) {
      playerCache = playerOverviewOther;
      dataType = CacheTypes.PLAYER_OVERVIEW_OTHER;
    } else {
      playerCache = playerOverviewSkill;
      dataType = CacheTypes.PLAYER_OVERVIEW_SKILL;
    }
  } else {
    (playerCache = playerOverviewSkill),
      (dataType = CacheTypes.PLAYER_OVERVIEW_SKILL);
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
      const field: string | undefined = fieldNameCheck(
        parsedInput.field,
        parsedInput.case
      );
      if (field === undefined) return;
      const result: TempleEmbed = generateResult(
        field,
        embed,
        playerCache[username + parsedInput.time],
        parsedInput.time,
        lowerCasedArguments
      );
      return msg.channel.send(result);
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
        const field: string | undefined = fieldNameCheck(
          parsedInput.field,
          parsedInput.case
        );
        if (field === undefined) return;
        const result: TempleEmbed = generateResult(
          field,
          embed,
          playerCache[username + timePeriod],
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
  playerObject: PlayerOverviewSkill | PlayerOverviewOther,
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
    case TempleOther.IM_EHP:
      formattedField = 'Ironman EHP';
      break;

    default:
      formattedField = field;
      break;
  }
  console.log(playerObject);

  // If there are no records the key value is an empty array

  // If there's no record for specific period of time then the key doesn't exist
  if (playerObject[TempleOther.TABLE][field] !== undefined) {
    // Formatting how numbers are displayed
    const value: string | number =
      playerObject[TempleOther.TABLE][field][TempleOther.XP];
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
};
