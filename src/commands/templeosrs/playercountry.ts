import { Message } from 'discord.js';
// Utils
import { runescapeNameValidator } from '../../utils/runescapeNameValidator';
import { stringOrArray } from '../../utils/stringOrArray';
import { TempleEmbed } from '../../utils/embed';
import { playerStats, fetchTemple } from '../../cache/templeCache';

export const playercountry = async (
  msg: Message,
  ...args: string[]
): Promise<Message | undefined> => {
  const nameCheck: boolean = runescapeNameValidator(...args);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const keyword: string = stringOrArray(...args);
  const embed: TempleEmbed = new TempleEmbed().addField('Username', `${args}`);

  if (keyword in playerStats) {
    const data = playerStats[keyword].info.Country;
    if (data === '-')
      return msg.channel.send(embed.addField('Country', `No Info`));
    else return msg.channel.send(embed.addField('Country', `${data}`));
  } else {
    const isFetched: boolean = await fetchTemple(msg, keyword);
    if (isFetched === true) {
      const data = playerStats[keyword].info.Country;
      if (data === '-') {
        return msg.channel.send(embed.addField('Country', 'No Info'));
      } else {
        return msg.channel.send(embed.addField('Country', `${data}`));
      }
    } else return;
  }
};
