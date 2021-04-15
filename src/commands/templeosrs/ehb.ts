import { Message } from 'discord.js';
import { runescapeNameValidator } from '../../utils/osrs/runescapeNameValidator';
import { argumentParser } from '../../utils/argumentParser';
import { TempleEmbed } from '../../utils/embed';
import { templeDateParser } from '../../utils/osrs/templeDateParser';
import { gameModeCheck } from '../../utils/osrs/gameModeCheck';
import { playerStats, fetchTemple, PlayerStats } from '../../cache/templeCache';

export const ehb = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const nameCheck: boolean = runescapeNameValidator(args);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const keyword: string = argumentParser(args, 0, 'osrs');
  const embed: TempleEmbed = new TempleEmbed().addField(
    'Username',
    `${args.join(' ')}`
  );
  if (keyword in playerStats) {
    const result = generateResult(embed, playerStats[keyword], keyword);
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchTemple(msg, keyword);
    if (isFetched === true) {
      const result = generateResult(embed, playerStats[keyword], keyword);
      return msg.channel.send(result);
    } else return;
  }
};

// Generate result
const generateResult = (
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
  if (gameMode === '') data = parseInt(playerObject.Ehb.toString());
  else data = parseInt(playerObject.Im_ehb.toString());
  embed.addField(`EHB ${gameMode}`, `${data}`);
  return embed;
};
