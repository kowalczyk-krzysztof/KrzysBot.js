import { Message } from 'discord.js';
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
import { ErrorEmbed, TempleEmbed, usernameString } from '../../utils/embed';
import { templeDateParser } from '../../utils/osrs/templeDateParser';
import { gameModeCheck, GameModeString } from '../../utils/osrs/gameModeCheck';
import {
  playerStats,
  PlayerStats,
  fetchTemple,
  CacheTypes,
} from '../../cache/templeCache';
import { TempleOther } from '../../utils/osrs/enums';

export const ehb = async (
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
  const gameMode: string = gameModeCheck(keyword);
  embed.addField(`${lastChecked.title}`, `${lastChecked.time}`);
  let data: number;
  if (gameMode === GameModeString.NORMAL)
    data = parseInt(playerObject[TempleOther.EHB].toString());
  else data = parseInt(playerObject[TempleOther.IM_EHB].toString());
  embed.addField(`EHB ${gameMode}`, `${data}`);
  return embed;
};
