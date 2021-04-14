import { Message } from 'discord.js';
// Utils
import { runescapeNameValidator } from '../../utils/osrs/runescapeNameValidator';
import { argsToString } from '../../utils/argsToString';
import { fetchPlayerNames } from '../../cache/templeCache';
import { isOnCooldown } from '../../cache/cooldown';
import { Embed } from '../../utils/embed';

export const fetchrsn = async (
  msg: Message,
  ...args: string[]
): Promise<Message | undefined> => {
  const cooldown: number = 600;
  const nameCheck: boolean = runescapeNameValidator(...args);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const keyword: string = argsToString(...args);
  if (isOnCooldown(msg, cooldown, true, keyword) === true) return;
  else {
    const areNamesFetched = await fetchPlayerNames(msg, keyword);

    if (areNamesFetched === true) {
      const embed: Embed = new Embed();
      embed.setDescription(
        `Fetched latest names available for player:\`\`\`${keyword}\`\`\`To get more recent data - add a new datapoint and fetch again`
      );
      return msg.channel.send(embed);
    } else return;
  }
};
