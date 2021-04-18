// Discord
import { Message } from 'discord.js';
// TempleOSRS Cache
import { playerStats, fetchTemple } from '../../cache/templeCache';
// UTILS: Embeds
import { ErrorEmbed, TempleEmbed, usernameString } from '../../utils/embed';
// UTILS: Interfaces
import { TemplePlayerStats } from '../../utils/osrs/interfaces';
// UTILS: Enums
import { TempleOther, TempleCacheType } from '../../utils/osrs/enums';
// UTILS: Runescape name validator
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Temple date parser
import { templeDateParser } from '../../utils/osrs/templeDateParser';
// UTILS: Game mode validator
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
  const nameCheck: string = runescapeNameValidator(args);
  if (nameCheck === invalidRSN) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  if (username in playerStats) {
    const result: TempleEmbed = generateResult(playerStats[username], username);
    return msg.channel.send(result);
  } else {
    const dataType: TempleCacheType = TempleCacheType.PLAYER_STATS;
    const isFetched: boolean = await fetchTemple(msg, username, dataType);
    if (isFetched === true) {
      const result: TempleEmbed = generateResult(
        playerStats[username],
        username
      );
      return msg.channel.send(result);
    } else return;
  }
};
// Generates embed sent to user
const generateResult = (
  playerObject: TemplePlayerStats,
  keyword: string
): TempleEmbed | ErrorEmbed => {
  if (playerObject === undefined) return new ErrorEmbed();
  else {
    const embed: TempleEmbed = new TempleEmbed().addField(
      usernameString,
      `${playerObject[TempleOther.INFO][TempleOther.USERNAME]}`
    );
    const lastChecked: { title: string; time: string } = templeDateParser(
      playerObject[TempleOther.INFO][TempleOther.LAST_CHECKED]
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
      data = parseInt(playerObject[TempleOther.IM_EHP_CAPITAL].toString());

      embed.addField(`${TempleOther.EHP.toUpperCase()} ${gameMode}`, `${data}`);
    }
    if (f2pOrSkiller === SkillerOrF2p.BOTH) {
      embed.addField(
        `${TempleOther.EHP.toUpperCase()} ${SkillerOrF2p.F2P}`,
        `${parseInt(playerObject[TempleOther.F2P_EHP].toString())}`
      );
      embed.addField(
        `${TempleOther.EHP.toUpperCase()} ${SkillerOrF2p.SKILLER}`,
        `${parseInt(playerObject[TempleOther.LVL3_EHP].toString())}`
      );
    } else if (f2pOrSkiller === SkillerOrF2p.SKILLER)
      embed.addField(
        `${TempleOther.EHP.toUpperCase()} ${SkillerOrF2p.SKILLER}`,
        `${parseInt(playerObject[TempleOther.LVL3_EHP].toString())}`
      );
    else if (f2pOrSkiller === SkillerOrF2p.F2P)
      embed.addField(
        `${TempleOther.EHP.toUpperCase()} ${SkillerOrF2p.F2P}`,
        `${parseInt(playerObject[TempleOther.F2P_EHP].toString())}`
      );
    else if (
      f2pOrSkiller === SkillerOrF2p.NONE &&
      gameMode === GameModeString.NORMAL
    ) {
      data = parseInt(playerObject[TempleOther.EHP].toString());
      embed.addField(`${TempleOther.EHP.toUpperCase()} ${gameMode}`, `${data}`);
    }
    return embed;
  }
};
