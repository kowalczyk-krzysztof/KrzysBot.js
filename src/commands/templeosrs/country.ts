// Discord
import { Message } from 'discord.js';
// TempleOSRS Cache
import { playerStats, fetchTemple } from '../../cache/templeCache';
// Cooldown cache
import { isOnCooldown } from '../../cache/cooldown';
// UTILS: Embeds
import { ErrorEmbed, TempleEmbed, usernameString } from '../../utils/embed';
// UTILS: Interfaces
import { TemplePlayerStats } from '../../utils/osrs/interfaces';
// UTILS: Enums
import {
  TempleOther,
  TempleCacheType,
  CommandCooldowns,
} from '../../utils/osrs/enums';
// UTILS: Runescape name validator
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';
// Anti-spam
import { isSpamming } from '../../cache/antiSpam';

export const country = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  if (isSpamming(msg, commandName)) return;
  const cooldown: number = CommandCooldowns.COUNTRY;
  const username: string | undefined = runescapeNameValidator(args);
  if (!username) return msg.channel.send(invalidUsername);
  if (isOnCooldown(msg, commandName, cooldown, false, username)) return;
  const embed: TempleEmbed = new TempleEmbed().addField(
    usernameString,
    `\`\`\`${username}\`\`\``
  );
  if (username in playerStats)
    return msg.channel.send(generateResult(embed, playerStats[username]));

  const dataType: TempleCacheType = TempleCacheType.PLAYER_STATS;
  const isFetched: boolean = await fetchTemple(msg, username, dataType);
  if (isFetched)
    return msg.channel.send(generateResult(embed, playerStats[username]));
  return;
};
// Generates embed sent to user
const generateResult = (
  embed: TempleEmbed,
  playerObject: TemplePlayerStats
): TempleEmbed | ErrorEmbed => {
  if (!playerObject) return errorHandler();
  const data: string = playerObject[TempleOther.INFO][TempleOther.COUNTRY];
  if (data === '-')
    embed.addField(`${TempleOther.COUNTRY}`, `\`\`\`NO INFO\`\`\``);
  else
    embed.addField(
      `${TempleOther.COUNTRY.toUpperCase()}:`,
      `\`\`\`${data}\`\`\``
    );
  return embed;
};
