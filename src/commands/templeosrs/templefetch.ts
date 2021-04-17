import { Message } from 'discord.js';
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
import { CacheTypes, fetchTemple } from '../../cache/templeCache';
import { isOnCooldown } from '../../cache/cooldown';
import { Embed } from '../../utils/embed';
import { errorHandler } from '../../utils/errorHandler';

export const templefetch = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const embed: Embed = new Embed();
  const dataType: CacheTypes | string = args[0].toLowerCase();
  const types: (CacheTypes | string)[] = [
    CacheTypes.PLAYER_NAMES,
    CacheTypes.PLAYER_RECORDS,
    CacheTypes.PLAYER_STATS,
  ];
  if (!types.includes(dataType))
    return msg.channel.send(
      embed.setDescription(
        `Invalid arguments. Valid arguments:\`\`\`\n${CacheTypes.PLAYER_NAMES}\n${CacheTypes.PLAYER_STATS}\n${CacheTypes.PLAYER_RECORDS}\`\`\``
      )
    );

  const cooldown: number = 600;
  const nameCheck: string | null = runescapeNameValidator(args.slice(1));
  if (nameCheck === null) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  if (isOnCooldown(msg, commandName, cooldown, true, username) === true) return;
  else {
    // const dataType: CacheTypes = CacheTypes.PLAYER_STATS;
    const isFetched: boolean = await fetchTemple(
      msg,
      username,
      dataType as CacheTypes
    );
    if (isFetched === true) {
      embed.setDescription(
        `Fetched latest **${dataType}** data available for player:\`\`\`${username}\`\`\`To get more recent data - add a new datapoint and fetch again`
      );
      return msg.channel.send(embed);
    } else return errorHandler(null, msg);
  }
};
