import { Message } from 'discord.js';
import { runescapeNameValidator } from '../../utils/runescapeNameValidator';
import { stringOrArray } from '../../utils/stringOrArray';
import { TempleEmbed } from '../../utils/embed';
import { playerStats, fetchTemple, GameMode } from '../../cache/templeCache';

export const ehp = async (
  msg: Message,
  ...args: string[]
): Promise<Message | undefined> => {
  const nameCheck: boolean = runescapeNameValidator(...args);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const keyword: string = stringOrArray(...args);
  const embed: TempleEmbed = new TempleEmbed().addField(
    'Username',
    `${args.join(' ')}`
  );
  if (keyword in playerStats) {
    const gameMode: GameMode = playerStats[keyword].info['Game mode'];
    let title: string;
    if (gameMode !== GameMode.MAIN) {
      const data = parseInt(playerStats[keyword].Im_ehp.toString());
      if (gameMode === GameMode.IM) {
        title = 'EHP-IM';
        return msg.channel.send(embed.addField(`${title}`, `${data}`));
      } else if (gameMode === GameMode.UIM) {
        title = 'EHP-UIM';
        return msg.channel.send(embed.addField(`${title}`, `${data}`));
      } else if (gameMode === GameMode.HCIM) {
        title = 'EHP-HCIM';
        return msg.channel.send(embed.addField(`${title}`, `${data}`));
      } else return;
    } else {
      const data = parseInt(playerStats[keyword].Ehp.toString());
      const title = 'EHP';
      return msg.channel.send(embed.addField(`${title}`, `${data}`));
    }
  } else {
    const isFetched: boolean = await fetchTemple(msg, keyword);
    if (isFetched === true) {
      const gameMode: GameMode = playerStats[keyword].info['Game mode'];
      let title: string;
      if (gameMode !== GameMode.MAIN) {
        const data = parseInt(playerStats[keyword].Im_ehp.toString());
        if (gameMode === GameMode.IM) {
          title = 'EHP-IM';
          return msg.channel.send(embed.addField(`${title}`, `${data}`));
        } else if (gameMode === GameMode.UIM) {
          title = 'EHP-UIM';
          return msg.channel.send(embed.addField(`${title}`, `${data}`));
        } else if (gameMode === GameMode.HCIM) {
          title = 'EHP-HCIM';
          return msg.channel.send(embed.addField(`${title}`, `${data}`));
        } else return;
      } else {
        const data = parseInt(playerStats[keyword].Ehp.toString());
        const title = 'EHP';
        return msg.channel.send(embed.addField(`${title}`, `${data}`));
      }
    } else return;
  }
};
