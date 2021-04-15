import { Message } from 'discord.js';
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
import { argumentParser, ParserTypes } from '../../utils/argumentParser';
import { TempleEmbed, usernameString } from '../../utils/embed';
import { templeDateParser } from '../../utils/osrs/templeDateParser';
import { playerStats, fetchTemple, PlayerStats } from '../../cache/templeCache';
import {
  gameModeCheck,
  skillerOrF2P,
  SkillerOrF2p,
  GameModeString,
} from '../../utils/osrs/gameModeCheck';

export const ehp = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const nameCheck: boolean = runescapeNameValidator(args);
  if (nameCheck === false) return msg.channel.send(invalidUsername);
  const keyword: string = argumentParser(args, 0, ParserTypes.OSRS);
  const embed: TempleEmbed = new TempleEmbed().addField(
    usernameString,
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
  embed.addField(`${lastChecked.title}`, `${lastChecked.time}`);
  const f2pOrSkiller: string = skillerOrF2P(username);
  let data: number;
  if (f2pOrSkiller === SkillerOrF2p.BOTH) {
    embed.addField(
      `EHP ${SkillerOrF2p.F2P}`,
      `${parseInt(playerObject.F2p_ehp.toString())}`
    );
    embed.addField(
      `EHP ${SkillerOrF2p.SKILLER}`,
      `${parseInt(playerObject.Lvl3_ehp.toString())}`
    );
  } else if (f2pOrSkiller === SkillerOrF2p.SKILLER)
    embed.addField(
      `EHP ${SkillerOrF2p.SKILLER}`,
      `${parseInt(playerObject.Lvl3_ehp.toString())}`
    );
  else if (f2pOrSkiller === SkillerOrF2p.F2P)
    embed.addField(
      `EHP ${SkillerOrF2p.F2P}`,
      `${parseInt(playerObject.F2p_ehp.toString())}`
    );
  else {
    const gameMode: string = gameModeCheck(username);

    if (gameMode === GameModeString.NORMAL)
      data = parseInt(playerObject.Ehp.toString());
    else data = parseInt(playerObject.Im_ehp.toString());
    embed.addField(`EHP ${gameMode}`, `${data}`);
  }
  return embed;
};
