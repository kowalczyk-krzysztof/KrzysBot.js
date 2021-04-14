import { Message } from 'discord.js';
// Utils
import { runescapeNameValidator } from '../../utils/runescapeNameValidator';
import { stringOrArray } from '../../utils/stringOrArray';
import { fetchTemple, fetchPlayerNames } from '../../cache/templeCache';
import { isOnCooldown } from '../../cache/cooldown';

export const updateplayer = async (
  msg: Message,
  ...args: string[]
): Promise<Message | undefined> => {
  const cooldown: number = 600;
  const nameCheck: boolean = runescapeNameValidator(...args);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const keyword: string = stringOrArray(...args);
  if (isOnCooldown(msg, cooldown, keyword, true) === true) return;
  else {
    const isPlayerFetched = await fetchTemple(msg, keyword);
    const isPlayerNamesFetched = await fetchPlayerNames(msg, keyword);
    if (isPlayerFetched === true && isPlayerNamesFetched == true)
      return msg.channel.send(
        `Fetched latest data available from TempleOSRS for player **${keyword}**`
      );
    else return;
  }
};
