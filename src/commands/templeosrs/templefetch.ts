import { Message } from 'discord.js';
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
import {
  CacheTypes,
  CacheTypesAliases,
  fetchTemple,
} from '../../cache/templeCache';
import { isOnCooldown } from '../../cache/cooldown';
import { Embed } from '../../utils/embed';
import { errorHandler } from '../../utils/errorHandler';

export const templefetch = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const embed: Embed = new Embed();
  let dataType: CacheTypes | string;
  let user: string[];
  if (args.length >= 2) {
    const joinedArgs: string = args[0] + args[1];
    if (joinedArgs.toLowerCase() === CacheTypes.PLAYER_OVERVIEW_SKILL) {
      dataType = joinedArgs.toLowerCase();
      user = args.slice(2);
    } else if (joinedArgs.toLowerCase() === CacheTypes.PLAYER_OVERVIEW_OTHER) {
      dataType = joinedArgs.toLowerCase();
      user = args.slice(2);
    } else {
      dataType = args[0].toLowerCase();
      user = args.slice(1);
    }
  } else {
    dataType = args[0];
    user = [''];
  }
  const types: (CacheTypes | string)[] = [
    CacheTypes.PLAYER_NAMES,
    CacheTypes.PLAYER_RECORDS,
    CacheTypes.PLAYER_STATS,
    CacheTypes.PLAYER_OVERVIEW_SKILL,
    CacheTypes.PLAYER_OVERVIEW_OTHER,
  ];
  if (!types.includes(dataType))
    return msg.channel.send(
      embed.setDescription(
        `Invalid arguments. Valid arguments:\`\`\`\n${CacheTypes.PLAYER_NAMES}\n${CacheTypes.PLAYER_STATS}\n${CacheTypes.PLAYER_RECORDS}\n${CacheTypesAliases.PLAYER_OVERVIEW_SKILL}\n${CacheTypesAliases.PLAYER_OVERVIEW_OTHER}\`\`\``
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
      dataType as CacheTypes
    );
    if (isFetched === true) {
      let formattedTypes: string;
      if (dataType === CacheTypes.PLAYER_OVERVIEW_SKILL)
        formattedTypes = CacheTypesAliases.PLAYER_OVERVIEW_SKILL;
      else if (dataType === CacheTypes.PLAYER_OVERVIEW_OTHER)
        formattedTypes = CacheTypesAliases.PLAYER_OVERVIEW_OTHER;
      else formattedTypes = dataType;
      embed.setDescription(
        `Fetched latest **${formattedTypes}** data available for player:\`\`\`${username}\`\`\`To get more recent data - add a new datapoint and fetch again`
      );
      return msg.channel.send(embed);
    } else return errorHandler(null, msg);
  }
};
