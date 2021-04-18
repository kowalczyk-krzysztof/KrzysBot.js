import { Message } from 'discord.js';
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
import { ErrorEmbed, TempleEmbed, usernameString } from '../../utils/embed';
import { templeDateParser } from '../../utils/osrs/templeDateParser';
import {
  playerStats,
  CacheTypes,
  fetchTemple,
  PlayerStats,
} from '../../cache/templeCache';
import {
  gameModeCheck,
  skillerOrF2P,
  SkillerOrF2p,
  GameModeString,
} from '../../utils/osrs/gameModeCheck';
import { TempleOther } from '../../utils/osrs/enums';

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
    const dataType: CacheTypes = CacheTypes.PLAYER_STATS;
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

// Generate result
const generateResult = (
  playerObject: PlayerStats,
  keyword: string
): TempleEmbed | ErrorEmbed => {
  if (playerObject === undefined) return new ErrorEmbed();
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
  const ehpString: string = 'EHP';

  if (gameMode !== GameModeString.NORMAL) {
    data = parseInt(playerObject[TempleOther.IM_EHP_CAPITAL].toString());

    embed.addField(`${ehpString} ${gameMode}`, `${data}`);
  }
  if (f2pOrSkiller === SkillerOrF2p.BOTH) {
    embed.addField(
      `${ehpString} ${SkillerOrF2p.F2P}`,
      `${parseInt(playerObject[TempleOther.F2P_EHP].toString())}`
    );
    embed.addField(
      `${ehpString} ${SkillerOrF2p.SKILLER}`,
      `${parseInt(playerObject[TempleOther.LVL3_EHP].toString())}`
    );
  } else if (f2pOrSkiller === SkillerOrF2p.SKILLER)
    embed.addField(
      `${ehpString} ${SkillerOrF2p.SKILLER}`,
      `${parseInt(playerObject[TempleOther.LVL3_EHP].toString())}`
    );
  else if (f2pOrSkiller === SkillerOrF2p.F2P)
    embed.addField(
      `${ehpString} ${SkillerOrF2p.F2P}`,
      `${parseInt(playerObject[TempleOther.F2P_EHP].toString())}`
    );
  else if (
    f2pOrSkiller === SkillerOrF2p.NONE &&
    gameMode === GameModeString.NORMAL
  ) {
    data = parseInt(playerObject[TempleOther.EHP].toString());
    embed.addField(`${ehpString} ${gameMode}`, `${data}`);
  }
  return embed;
};
