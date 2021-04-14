import { Message } from 'discord.js';
import { runescapeNameValidator } from '../../utils/osrs/runescapeNameValidator';
import { argsToString } from '../../utils/argsToString';
import { TempleEmbed } from '../../utils/embed';
import { templeDateParser } from '../../utils/osrs/templeDateParser';
import { playerStats, fetchTemple, PlayerStats } from '../../cache/templeCache';
import { gameModeCheck } from '../../utils/osrs/gameModeCheck';

export const ehp = async (
  msg: Message,
  ...args: string[]
): Promise<Message | undefined> => {
  const nameCheck: boolean = runescapeNameValidator(...args);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const keyword: string = argsToString(...args);
  const embed: TempleEmbed = new TempleEmbed().addField(
    'Username',
    `${args.join(' ')}`
  );
  if (keyword in playerStats) {
    const result = generateEmbed(embed, playerStats[keyword], keyword);
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchTemple(msg, keyword);
    if (isFetched === true) {
      const result = generateEmbed(embed, playerStats[keyword], keyword);
      return msg.channel.send(result);
    } else return;
  }
};

// Generate result
const generateEmbed = (
  inputEmbed: TempleEmbed,
  playerObject: PlayerStats,
  keyword: string
): TempleEmbed => {
  const username: string = keyword;
  const embed: TempleEmbed = inputEmbed;
  const lastChecked: { title: string; time: string } = templeDateParser(
    playerObject.info['Last checked']
  );
  const gameMode: string = gameModeCheck(username);
  embed.addField(`${lastChecked.title}`, `${lastChecked.time}`);
  let data: number;
  if (gameMode === '') data = parseInt(playerObject.Ehp.toString());
  else data = parseInt(playerObject.Im_ehp.toString());
  embed.addField(`EHP ${gameMode}`, `${data}`);
  return embed;
};
