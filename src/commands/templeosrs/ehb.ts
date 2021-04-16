import { Message } from 'discord.js';
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
import { argumentParser, ParserTypes } from '../../utils/argumentParser';
import { TempleEmbed, usernameString } from '../../utils/embed';
import { templeDateParser } from '../../utils/osrs/templeDateParser';
import { gameModeCheck, GameModeString } from '../../utils/osrs/gameModeCheck';
import { playerStats, fetchTemple, PlayerStats } from '../../cache/templeCache';

export const ehb = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const nameCheck: boolean = runescapeNameValidator(args);
  if (nameCheck === false) return msg.channel.send(invalidUsername);
  const keyword: string = argumentParser(args, 0, ParserTypes.OSRS);
  if (keyword in playerStats) {
    const result: TempleEmbed = generateResult(playerStats[keyword], keyword);
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchTemple(msg, keyword);
    if (isFetched === true) {
      const result: TempleEmbed = generateResult(playerStats[keyword], keyword);
      return msg.channel.send(result);
    } else return;
  }
};

// Generate result
const generateResult = (
  playerObject: PlayerStats,
  keyword: string
): TempleEmbed => {
  const embed: TempleEmbed = new TempleEmbed().addField(
    usernameString,
    `${playerObject.info.Username}`
  );
  const lastChecked: { title: string; time: string } = templeDateParser(
    playerObject.info['Last checked']
  );
  const gameMode: string = gameModeCheck(keyword);
  embed.addField(`${lastChecked.title}`, `${lastChecked.time}`);
  let data: number;
  if (gameMode === GameModeString.NORMAL)
    data = parseInt(playerObject.Ehb.toString());
  else data = parseInt(playerObject.Im_ehb.toString());
  embed.addField(`EHB ${gameMode}`, `${data}`);
  return embed;
};
