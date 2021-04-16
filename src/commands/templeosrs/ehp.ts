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
  if (keyword in playerStats) {
    const result = generateResult(playerStats[keyword], keyword);
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchTemple(msg, keyword);
    if (isFetched === true) {
      const result = generateResult(playerStats[keyword], keyword);
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
  embed.addField(`${lastChecked.title}`, `${lastChecked.time}`);
  const f2pOrSkiller: string = skillerOrF2P(keyword);
  const gameMode: string = gameModeCheck(keyword);
  let data: number;
  /*
    First check if player is ironman, if so add ironman ehp (the value is the same for all ironman accounts)
    Then check if account is f2p or skiller, if both add both fields else add respective fields. If none of the checks passes then just return normal EHP
    
    Expected result for lvl 3 f2p ironman skiller:
    EHP UIM
    4549
    EHP F2P
    6591
    EHP Level 3 skiller
    4064

  */
  if (gameMode !== GameModeString.NORMAL) {
    data = parseInt(playerObject.Im_ehp.toString());

    embed.addField(`EHP ${gameMode}`, `${data}`);
  }
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
  else if (
    f2pOrSkiller === SkillerOrF2p.NONE &&
    gameMode === GameModeString.NORMAL
  ) {
    data = parseInt(playerObject.Ehp.toString());
    embed.addField(`EHP ${gameMode}`, `${data}`);
  }
  return embed;
};
