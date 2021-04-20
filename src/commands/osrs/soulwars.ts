// Discord
import { Message } from 'discord.js';
// OSRS cache
import { fetchOsrsStats, osrsStats } from '../../cache/osrsCache';
// Cooldown cache
import { isOnCooldown } from '../../cache/cooldown';
// UTILS: Embeds
import {
  OsrsEmbed,
  EmbedTitles,
  usernameString,
  ErrorEmbed,
} from '../../utils/embed';
// UTILS: Interfaces
import { OsrsPlayer } from '../../utils/osrs/interfaces';
// UTILS: Enums
import {
  CommandCooldowns,
  OsrsOther,
  TempleOther,
} from '../../utils/osrs/enums';
// UTILS: Runescape name validator
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';
// Anti-spam
import { antiSpam } from '../../cache/antiSpam';

export const soulwars = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  if (antiSpam(msg, commandName) === true) return;
  const cooldown: number = CommandCooldowns.SOULWARS;
  const nameCheck: string = runescapeNameValidator(args);
  if (nameCheck === invalidRSN) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  if (isOnCooldown(msg, commandName, cooldown, false, username) === true)
    return;
  const embed: OsrsEmbed = new OsrsEmbed()
    .setTitle(EmbedTitles.SOULWARS)
    .addField(usernameString, `\`\`\`${username}\`\`\``);
  if (username in osrsStats) {
    const result: OsrsEmbed = generateResult(embed, osrsStats[username]);
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchOsrsStats(msg, username);
    if (isFetched === true) {
      const result: OsrsEmbed = generateResult(embed, osrsStats[username]);
      return msg.channel.send(result);
    } else return;
  }
};
// Generates embed sent to user
const generateResult = (
  embed: OsrsEmbed,
  playerObject: OsrsPlayer
): OsrsEmbed | ErrorEmbed => {
  if (playerObject === undefined || playerObject === null)
    return errorHandler();
  else {
    embed.addField(
      `${OsrsOther.SOULWARS.toUpperCase()}:`,
      `\`\`\`${playerObject[OsrsOther.SOULWARS][TempleOther.SCORE]}\`\`\``
    );
    return embed;
  }
};
