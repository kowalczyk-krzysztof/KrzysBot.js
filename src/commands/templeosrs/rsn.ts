import { Message } from 'discord.js';
// Utils
import { runescapeNameValidator } from '../../utils/runescapeNameValidator';
import { stringOrArray } from '../../utils/stringOrArray';
import { TempleEmbed } from '../../utils/embed';
import { playerNames, fetchPlayerNames } from '../../cache/templeCache';

export const rsn = async (
  msg: Message,
  ...args: string[]
): Promise<Message | undefined> => {
  const nameCheck: boolean = runescapeNameValidator(...args);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const keyword: string = stringOrArray(...args);

  if (keyword in playerNames) {
    const aliases = playerNames[keyword].aliases;
    const names = [];
    for (const alias in aliases) {
      names.push(alias);
    }
    const data = names.join('\n');
    const embed: TempleEmbed = new TempleEmbed().addField('Names', `${data}`);
    return msg.channel.send(embed);
  } else {
    const isFetched: boolean = await fetchPlayerNames(msg, keyword);
    if (isFetched === true) {
      const aliases = playerNames[keyword].aliases;
      const names = [];
      for (const alias in aliases) {
        names.push(alias);
      }
      const data = names.join('\n');
      const embed: TempleEmbed = new TempleEmbed().addField('Names', `${data}`);
      return msg.channel.send(embed);
    } else return;
  }
};
