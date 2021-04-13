import { Message } from 'discord.js';
// Utils
import { runescapeNameValidator } from '../../utils/runescapeNameValidator';
import { stringOrArray } from '../../utils/stringOrArray';
import { fetchTemple } from '../../cache/templeCache';
import { setCooldown } from '../../cache/cooldown';

export const updateplayer = async (
  msg: Message,
  ...args: string[]
): Promise<Message | undefined> => {
  const nameCheck: boolean = runescapeNameValidator(...args);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const keyword: string = stringOrArray(...args);
  if (setCooldown(msg, 300, keyword, true) === true) return;
  else {
    const isFetched = await fetchTemple(msg, keyword);
    if (isFetched === true)
      return msg.channel.send(`Updated player: ${keyword}`);
    else return;
  }
};
