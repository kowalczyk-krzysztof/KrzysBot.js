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
  TempleCacheType,
  TempleCacheTypeAliases,
} from '../../utils/osrs/enums';
// UTILS: Runescape name validator
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';

const types: (TempleCacheType | string)[] = [
  TempleCacheType.PLAYER_NAMES,
  TempleCacheType.PLAYER_RECORDS,
  TempleCacheType.PLAYER_STATS,
  TempleCacheType.PLAYER_OVERVIEW_SKILL,
  TempleCacheType.PLAYER_OVERVIEW_OTHER,
];

export const templefetch = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const embed: Embed = new Embed();
  if (args.length === 0)
    return msg.channel.send(
      embed.setDescription(
        `Invalid arguments. Valid arguments:\`\`\`\n${TempleCacheType.PLAYER_NAMES}\n${TempleCacheType.PLAYER_STATS}\n${TempleCacheType.PLAYER_RECORDS}\n${TempleCacheTypeAliases.PLAYER_OVERVIEW_SKILL}\n${TempleCacheTypeAliases.PLAYER_OVERVIEW_OTHER}\`\`\``
      )
    );

  let dataType: TempleCacheType | string;
  let user: string[];
  if (args.length >= 2) {
    const joinedArgs: string = args[0] + args[1];
    if (joinedArgs.toLowerCase() === TempleCacheType.PLAYER_OVERVIEW_SKILL) {
      dataType = joinedArgs.toLowerCase();
      user = args.slice(2);
    } else if (
      joinedArgs.toLowerCase() === TempleCacheType.PLAYER_OVERVIEW_OTHER
    ) {
      dataType = joinedArgs.toLowerCase();
      user = args.slice(2);
    } else {
      dataType = args[0].toLowerCase();
      user = args.slice(1);
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

  const cooldown: number = 600;
  const nameCheck: string = runescapeNameValidator(user);
  if (nameCheck === invalidRSN) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  if (isOnCooldown(msg, commandName, cooldown, true, username) === true) return;
  else {
    const isFetched: boolean = await fetchTemple(
      msg,
      username,
      dataType as TempleCacheType
    );
    if (isFetched === true) {
      let formattedTypes: string;
      if (dataType === TempleCacheType.PLAYER_OVERVIEW_SKILL)
        formattedTypes = TempleCacheTypeAliases.PLAYER_OVERVIEW_SKILL;
      else if (dataType === TempleCacheType.PLAYER_OVERVIEW_OTHER)
        formattedTypes = TempleCacheTypeAliases.PLAYER_OVERVIEW_OTHER;
      else formattedTypes = dataType;
      embed.setDescription(
        `Fetched latest **${formattedTypes}** data available for player:\`\`\`${username}\`\`\`To get more recent data - add a new datapoint and fetch again`
      );
      return msg.channel.send(embed);
    } else msg.channel.send(errorHandler());
  }
};
