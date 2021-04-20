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
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';
// Anti-spam
import { antiSpam } from '../../cache/antiSpam';

export const country = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  if (antiSpam(msg, commandName) === true) return;
  const nameCheck: string | undefined = runescapeNameValidator(args);
  if (nameCheck === undefined) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  const embed: TempleEmbed = new TempleEmbed().addField(
    usernameString,
    `\`\`\`${username}\`\`\``
  );
  if (username in playerStats) {
    const result: TempleEmbed = generateResult(embed, playerStats[username]);
    return msg.channel.send(result);
  } else {
    const dataType: TempleCacheType = TempleCacheType.PLAYER_STATS;
    const isFetched: boolean = await fetchTemple(msg, username, dataType);
    if (isFetched === true) {
      const result: TempleEmbed = generateResult(embed, playerStats[username]);
      return msg.channel.send(result);
    } else return;
  }
};
// Generates embed sent to user
const generateResult = (
  embed: TempleEmbed,
  playerObject: TemplePlayerStats
): TempleEmbed | ErrorEmbed => {
  if (playerObject === undefined || playerObject === null)
    return errorHandler();
  else {
    const data: string = playerObject[TempleOther.INFO][TempleOther.COUNTRY];
    if (data === '-')
      embed.addField(`${TempleOther.COUNTRY}`, `\`\`\`NO INFO\`\`\``);
    else
      embed.addField(
        `${TempleOther.COUNTRY.toUpperCase()}:`,
        `\`\`\`${data}\`\`\``
      );
    return embed;
  }
};
