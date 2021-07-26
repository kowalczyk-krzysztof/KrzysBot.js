// Discord
import { Message } from 'discord.js';
// TempleOSRS Cache
import { fetchTemple } from '../../cache/templeCache';
// Cooldown cache
import { isOnCooldown } from '../../cache/cooldown';
// UTILS: Embeds
import { Embed } from '../../utils/embed';
// UTILS: Enums
import {
  CommandCooldowns,
  TempleCacheType,
  TempleCacheTypeAliases,
  TempleOverviewTimeAliases,
  TempleOverviewTimes,
} from '../../utils/osrs/enums';
// UTILS: Runescape name validator
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';
// UTILS: Temple Overview time validator
import {
  formatOverviewTime,
  templeOverviewTimeValidator,
} from '../../utils/osrs/templetime';
// Anti-spam
import { isSpamming } from '../../cache/antiSpam';

const types: (TempleCacheType | string)[] = [
  TempleCacheType.PLAYER_NAMES,
  TempleCacheType.PLAYER_RECORDS,
  TempleCacheType.PLAYER_STATS,
  TempleCacheType.PLAYER_OVERVIEW_SKILL,
  TempleCacheType.PLAYER_OVERVIEW_OTHER,
];

export const temple = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  if (isSpamming(msg, commandName)) return;
  const embed: Embed = new Embed();
  if (!args.length)
    return msg.channel.send(
      embed.setDescription(
        `Invalid arguments. Valid arguments:\`\`\`\n${TempleCacheType.PLAYER_NAMES}\n${TempleCacheType.PLAYER_STATS}\n${TempleCacheType.PLAYER_RECORDS}\n${TempleCacheTypeAliases.PLAYER_OVERVIEW_SKILL}\n${TempleCacheTypeAliases.PLAYER_OVERVIEW_OTHER}\`\`\``
      )
    );
  const lowerCasedArguments: string[] = args.map((e: string) => {
    return e.toLowerCase();
  });

  let dataType: TempleCacheType | string;
  let user: string[];
  let time: string;
  if (args.length >= 2) {
    const joinedArgs: string = args[0] + args[1];
    if (joinedArgs.toLowerCase() === TempleCacheType.PLAYER_OVERVIEW_SKILL) {
      dataType = joinedArgs.toLowerCase();
      const validTime: string | undefined = templeOverviewTimeValidator(
        args[2]
      );
      if (!validTime) return;

      user = args.slice(3);
      time = validTime;
    } else if (
      joinedArgs.toLowerCase() === TempleCacheType.PLAYER_OVERVIEW_OTHER
    ) {
      dataType = joinedArgs.toLowerCase();
      const validTime: string | undefined = templeOverviewTimeValidator(
        args[2]
      );
      if (!validTime) return;

      user = args.slice(3);
      time = validTime;
    } else {
      dataType = args[0].toLowerCase();
      user = args.slice(1);
      time = '';
    }
  } else {
    return;
  }

  if (!types.includes(dataType))
    return msg.channel.send(
      embed.setDescription(
        `Invalid arguments. Valid arguments:\`\`\`\n${TempleCacheType.PLAYER_NAMES}\n${TempleCacheType.PLAYER_STATS}\n${TempleCacheType.PLAYER_RECORDS}\n${TempleCacheTypeAliases.PLAYER_OVERVIEW_SKILL}\n${TempleCacheTypeAliases.PLAYER_OVERVIEW_OTHER}\`\`\``
      )
    );
  const cooldown: number = CommandCooldowns.TEMPLE;
  const username: string | undefined = runescapeNameValidator(user);
  if (!username) return msg.channel.send(invalidUsername);
  if (
    isOnCooldown(msg, commandName, cooldown, true, lowerCasedArguments.join(''))
  )
    return;

  const isFetched: boolean = await fetchTemple(
    msg,
    username,
    dataType as TempleCacheType,
    time
  );
  if (isFetched) {
    let formattedTypes: string;
    let formattedTime: string;
    switch (time) {
      case TempleOverviewTimes.FIVEMIN:
        formattedTime = TempleOverviewTimeAliases.FIVEMIN;
        break;
      case TempleOverviewTimes.DAY:
        formattedTime = TempleOverviewTimeAliases.DAY;
        break;
      case TempleOverviewTimes.WEEK:
        formattedTime = TempleOverviewTimeAliases.WEEK;
        break;
      case TempleOverviewTimes.MONTH:
        formattedTime = TempleOverviewTimeAliases.MONTH;
        break;
      case TempleOverviewTimes.HALFYEAR:
        formattedTime = TempleOverviewTimeAliases.HALFYEAR;
        break;
      case TempleOverviewTimes.YEAR:
        formattedTime = TempleOverviewTimeAliases.YEAR;
        break;
      case TempleOverviewTimes.ALLTIME:
        formattedTime = TempleOverviewTimeAliases.ALLTIME;
        break;
      default:
        formattedTime = time;
        break;
    }
    if (dataType === TempleCacheType.PLAYER_OVERVIEW_SKILL)
      formattedTypes = `${TempleCacheTypeAliases.PLAYER_OVERVIEW_SKILL.toUpperCase()} (${formatOverviewTime(
        formattedTime
      ).toUpperCase()})`;
    else if (dataType === TempleCacheType.PLAYER_OVERVIEW_OTHER)
      formattedTypes = `${TempleCacheTypeAliases.PLAYER_OVERVIEW_OTHER.toUpperCase()} (${formatOverviewTime(
        formattedTime
      ).toUpperCase()})`;
    else formattedTypes = dataType.toUpperCase();
    embed.setDescription(
      `Fetched latest **${formattedTypes}** data available for player:\n\`\`\`${username}\`\`\``
    );
    return msg.channel.send(embed);
  }
  msg.channel.send(errorHandler());
};
