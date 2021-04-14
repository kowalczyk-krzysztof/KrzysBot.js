import { Message } from 'discord.js';
// Utils
import { runescapeNameValidator } from '../../utils/runescapeNameValidator';
import { stringOrArray } from '../../utils/stringOrArray';
import { Embed } from '../../utils/embed';
import { playerNames, fetchPlayerNames } from '../../cache/templeCache';

export const rsn = async (
  msg: Message,
  ...args: string[]
): Promise<Message | undefined> => {
  const nameCheck: boolean = runescapeNameValidator(...args);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const keyword: string = stringOrArray(...args);
  const embed: Embed = new Embed().setFooter(
    'Incorrect? Fetch latest names:\n.fetchrsn username'
  );

  if (keyword in playerNames) {
    const aliases = playerNames[keyword].aliases;
    const names = [];
    for (const alias in aliases) {
      names.push(alias);
    }
    const data = names.join('\n');
    embed.addField('Names', `${data}`);
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
      embed.addField('Names', `${data}`);
      return msg.channel.send(embed);
    } else return;
  }
};
