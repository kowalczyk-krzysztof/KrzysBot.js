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
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';

export const playercountry = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const nameCheck: string = runescapeNameValidator(args);
  if (nameCheck === invalidRSN) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  if (username in playerStats) {
    const result: TempleEmbed = generateResult(playerStats[username]);
    return msg.channel.send(result);
  } else {
    const dataType: TempleCacheType = TempleCacheType.PLAYER_STATS;
    const isFetched: boolean = await fetchTemple(msg, username, dataType);
    if (isFetched === true) {
      const result: TempleEmbed = generateResult(playerStats[username]);
      return msg.channel.send(result);
    } else return;
  }
};
// Generates embed sent to user
const generateResult = (
  playerObject: TemplePlayerStats
): TempleEmbed | ErrorEmbed => {
  if (playerObject === undefined) return errorHandler();
  else {
    const embed: TempleEmbed = new TempleEmbed().addField(
      usernameString,
      `${playerObject[TempleOther.INFO][TempleOther.USERNAME]}`
    );
    const data: string = playerObject[TempleOther.INFO][TempleOther.COUNTRY];
    if (data === '-') embed.addField(`${TempleOther.COUNTRY}`, 'No Info');
    else embed.addField(`${TempleOther.COUNTRY}`, `${data}`);
    return embed;
  }
};
