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
  Embed,
} from '../../utils/embed';
// UTILS: Interfaces
import {
  TempleOtherTableProps,
  SkillTableProps,
  TempleOverviewOther,
  TempleOverviewSkill,
  TempleOtherTable,
  TempleSkillTable,
} from '../../utils/osrs/interfaces';
// UTILS: Enums
import {
  TempleOther,
  TempleOverviewTimeAliases,
  TempleOverviewTimes,
  TempleCacheType,
  ValidInputCases,
  OsrsRandom,
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
// UTILS: Temple Overview time validator
import { formatOverviewTime } from '../../utils/osrs/templetime';

export const gains = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined | ErrorEmbed> => {
  if (antiSpam(msg, commandName) === true) return;
  if (args.length === 0) {
    if (commandName === OsrsCommands.GAINS)
      return msg.channel.send(
        new Embed().setDescription(
          `**Please provide arguments. Valid formats**:\`\`\`.${OsrsCommands.GAINS} clues tier time username\n\n.${OsrsCommands.GAINS} other ehb/ehp/lms/imehp time username\n\n.${OsrsCommands.GAINS} skill skill-name time username\n\n.${OsrsCommands.GAINS} boss boss-name time username\`\`\``
        )
      );
    else
      return msg.channel.send(
        new Embed().setDescription(
          `**Please provide arguments. Valid formats**:\`\`\`.${OsrsCommands.RECORD} clues tier time username\n\n.${OsrsCommands.RECORD} other ehb/ehp/lms/ time username\n\n.${OsrsCommands.RECORD} skill skill-name time username\n\n.${OsrsCommands.RECORD} boss boss-name time username\`\`\``
        )
      );
  }
  // This is done so the cooldown is per unique command
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
  // There are two API endpoints, one for bosses/other and one for skills. Assign relevant cache based on "case" field. NOTE: for getting ehp or ehb user uses ".gains other" command but EHP is a key on skills object and EHB is a key on boss object
  let playerCache: { [key: string]: TempleOverviewOther & TempleOverviewSkill };
  let dataType: TempleCacheType;
  if (parsedInput === undefined) return;
  else if (
    parsedInput.case === ValidInputCases.BOSS ||
    parsedInput.case === ValidInputCases.CLUES
  ) {
    playerCache = playerOverviewOther as {
      [key: string]: TempleOverviewOther & TempleOverviewSkill;
    };
    dataType = TempleCacheType.PLAYER_OVERVIEW_OTHER;
  } else if (parsedInput.case === ValidInputCases.OTHER) {
    if (
      parsedInput.field === TempleOther.EHB_LOWERCASE ||
      parsedInput.field === TempleOther.LMS_LOWERCASE
    ) {
      playerCache = playerOverviewOther as {
        [key: string]: TempleOverviewOther & TempleOverviewSkill;
      };
      dataType = TempleCacheType.PLAYER_OVERVIEW_OTHER;
    } else {
      playerCache = playerOverviewSkill as {
        [key: string]: TempleOverviewOther & TempleOverviewSkill;
      };
      dataType = TempleCacheType.PLAYER_OVERVIEW_SKILL;
    }
  } else {
    (playerCache = playerOverviewSkill as {
      [key: string]: TempleOverviewOther & TempleOverviewSkill;
    }),
      (dataType = TempleCacheType.PLAYER_OVERVIEW_SKILL);
  }
  const cooldown: number = CommandCooldowns.GAINS;
  if (
    parsedInput.rsn !== undefined &&
    parsedInput.time !== undefined &&
    parsedInput.field !== undefined &&
    parsedInput.case !== undefined
  ) {
    // Check is username is correct runescape name
    const nameCheck: string | undefined = runescapeNameValidator(
      parsedInput.rsn
    );
    if (nameCheck === undefined) return msg.channel.send(invalidUsername);
    const username: string = nameCheck;
    // Check cooldown
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
      .setTitle(EmbedTitles.GAINS)
      .addField(usernameString, `\`\`\`${username}\`\`\``);
    // Changing time aliases
    let timePeriod: string;
    switch (parsedInput.time) {
      case TempleOverviewTimeAliases.FIVEMIN:
        timePeriod = TempleOverviewTimes.FIVEMIN;
        break;
      case TempleOverviewTimeAliases.DAY:
        timePeriod = TempleOverviewTimes.DAY;
        break;
      case TempleOverviewTimeAliases.WEEK:
        timePeriod = TempleOverviewTimes.WEEK;
        break;
      case TempleOverviewTimeAliases.MONTH:
        timePeriod = TempleOverviewTimes.MONTH;
        break;
      case TempleOverviewTimeAliases.HALFYEAR:
        timePeriod = TempleOverviewTimes.HALFYEAR;
        break;
      case TempleOverviewTimeAliases.YEAR:
        timePeriod = TempleOverviewTimes.YEAR;
        break;
      case TempleOverviewTimeAliases.ALLTIME:
        timePeriod = TempleOverviewTimes.ALLTIME;
        break;
      default:
        timePeriod = parsedInput.time;
        break;
    }
    // Because there are multiple time options, I want to have separate keys for each option, so instead of passing username I'm passing username + time so the key name becomes "zezimaweek" instead of just "zezima"
    const userNameWithTime: string = username + timePeriod;
    // Check if object is in relevant cache
    if (userNameWithTime in playerCache) {
      // Try to match the input field with key name on player object
      const field: keyof TempleOtherTable &
        keyof TempleSkillTable = fieldNameCheck(
        parsedInput.field,
        parsedInput.case
      ) as keyof TempleOtherTable & keyof TempleSkillTable;
      if (field === undefined) return errorHandler();
      else {
        // Generate embed
        const result: TempleEmbed = generateResult(
          embed,
          playerCache[userNameWithTime] as TempleOverviewSkill &
            TempleOverviewOther,
          field,
          parsedInput.time,
          lowerCasedArguments
        );
        return msg.channel.send(result);
      }
    } else {
      // Fetch data
      const isFetched: boolean = await fetchTemple(
        msg,
        username,
        dataType,
        timePeriod
      );
      if (isFetched === true) {
        const field: keyof TempleOtherTable &
          // Try to match the input field with key name on player object
          keyof TempleSkillTable = fieldNameCheck(
          parsedInput.field,
          parsedInput.case
        ) as keyof TempleOtherTable & keyof TempleSkillTable;
        if (field === undefined) return errorHandler();
        else {
          // Generate embed
          const result: TempleEmbed = generateResult(
            embed,
            playerCache[userNameWithTime] as TempleOverviewSkill &
              TempleOverviewOther,
            field,
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
  embed: TempleEmbed,
  playerObject: TempleOverviewOther & TempleOverviewSkill,
  field: keyof TempleOtherTable & keyof TempleSkillTable,
  time: string,
  args: string[]
): TempleEmbed | ErrorEmbed => {
  if (playerObject === undefined || playerObject === null)
    return errorHandler();
  else {
    const formattedTime: string = formatOverviewTime(time);
    const formattedField: string = fieldNameFormatter(field);
    const table: TempleOtherTable & TempleSkillTable =
      playerObject[TempleOther.TABLE];
    const fieldTocheck: TempleOtherTableProps & SkillTableProps = table[field];
    // If there's no record for specific period of time then the key doesn't exist
    if (fieldTocheck !== undefined) {
      // Formatting how numbers are displayed
      embed.addField(
        `${OsrsRandom.TIME_PERIOD}:`,
        `\`\`\`${formattedTime}\`\`\``
      );
      const value: number = fieldTocheck[TempleOther.XP];
      let formattedValue;

      if (args[0] === ValidInputCases.SKILL)
        formattedValue = numberFormatter(
          value as number,
          NumberFormatTypes.EN_US
        );
      else if (value === null) formattedValue = 0;
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
      embed.addField(
        `${formattedField}`,
        `\`\`\`${formattedValue}${ending}\`\`\``
      );
      if (args[0] === ValidInputCases.SKILL) {
        let level: number;
        if (fieldTocheck[TempleOther.LEVEL] === null) level = 0;
        else level = fieldTocheck[TempleOther.LEVEL];
        embed.addField(
          `${TempleOther.LEVEL.toUpperCase()}S GAINED:`,
          `\`\`\`${level}\`\`\``
        );
      }
      if (args[0] === ValidInputCases.SKILL) {
        let ehp: number;
        if (fieldTocheck[TempleOther.EHP_LOWERCASE] === null) ehp = 0;
        else ehp = fieldTocheck[TempleOther.EHP_LOWERCASE];
        embed.addField(
          `${TempleOther.EHP.toUpperCase()} GAINED:`,
          `\`\`\`${parseInt(ehp.toString())}\`\`\``
        );
      }
      if (args[0] === ValidInputCases.BOSS) {
        let ehb: number;
        if (fieldTocheck[TempleOther.EHB_LOWERCASE] === null) ehb = 0;
        else ehb = fieldTocheck[TempleOther.EHB_LOWERCASE];
        embed.addField(
          `${TempleOther.EHB.toUpperCase()} GAINED:`,
          `\`\`\`${parseInt(ehb.toString())}\`\`\``
        );
      }
      let plusOrMinus: string;
      let rank: number;
      if (fieldTocheck[TempleOther.RANK] === null) rank = 0;
      else rank = fieldTocheck[TempleOther.RANK];

      if (fieldTocheck[TempleOther.RANK] > 0) plusOrMinus = '+';
      else plusOrMinus = '';
      embed.addField(
        `RANKS GAINED OR LOST:`,
        `\`\`\`${plusOrMinus}${parseInt(rank.toString())}\`\`\``
      );
      if (formattedTime === 'All Time')
        embed.addField('NOTE:', `Temple boss tracking started on 01/01/2020`);
    } else {
      embed.addField(
        `${OsrsRandom.NO_DATA}`,
        `No gains for this period of time for \`\`\`${formattedField}\`\`\``
      );
    }
    return embed;
  }
};
