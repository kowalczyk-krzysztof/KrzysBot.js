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
