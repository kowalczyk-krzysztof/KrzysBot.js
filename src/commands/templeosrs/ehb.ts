// Discord
import { Message } from 'discord.js';
// TempleOSRS Cache
import { playerStats, fetchTemple } from '../../cache/templeCache';
// UTILS: Embeds
import { ErrorEmbed, TempleEmbed, usernameString } from '../../utils/embed';
// UTILS: Interfaces
import { TemplePlayerStats } from '../../utils/osrs/interfaces';
// UTILS: Enums
import { TempleCacheType, TempleOther } from '../../utils/osrs/enums';
// UTILS: Runescape name validator
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Temple date parser
import { templeDateParser } from '../../utils/osrs/templeDateParser';
// UTILS: Game mode validator
import { gameModeCheck, GameModeString } from '../../utils/osrs/gameModeCheck';

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
    const gameMode: string = gameModeCheck(keyword);
    embed.addField(`${lastChecked.title}`, `${lastChecked.time}`);
    let data: number;
    if (gameMode === GameModeString.NORMAL)
      data = parseInt(playerObject[TempleOther.EHB].toString());
    else data = parseInt(playerObject[TempleOther.IM_EHB].toString());
    embed.addField(`${TempleOther.EHB.toUpperCase()} ${gameMode}`, `${data}`);
    return embed;
  }
};
