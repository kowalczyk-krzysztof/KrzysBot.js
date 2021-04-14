import { Message } from 'discord.js';
// Utils
import { runescapeNameValidator } from '../../utils/osrs/runescapeNameValidator';
import { argsToString } from '../../utils/argsToString';
import { fetchTemple } from '../../cache/templeCache';
import { isOnCooldown } from '../../cache/cooldown';
import { Embed } from '../../utils/embed';
import { errorHandler } from '../../utils/errorHandler';

export const templefetch = async (
  msg: Message,
  ...args: string[]
): Promise<Message | undefined> => {
  const cooldown: number = 600;
  const nameCheck: boolean = runescapeNameValidator(...args);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const keyword: string = argsToString(...args);
  if (isOnCooldown(msg, cooldown, true, keyword) === true) return;
  else {
    const isPlayerFetched = await fetchTemple(msg, keyword);

    if (isPlayerFetched === true) {
      const embed: Embed = new Embed();
      embed.setDescription(
        `Fetched latest data available for player:\`\`\`${keyword}\`\`\`To get more recent data - add a new datapoint and fetch again`
      );
      return msg.channel.send(embed);
    } else return errorHandler(null, msg);
  }
};
