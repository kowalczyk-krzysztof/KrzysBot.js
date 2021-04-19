// Discord
import { Message } from 'discord.js';
// OSRS cache
import { fetchOsrsStats } from '../../cache/osrsCache';
// Cooldown cache
import { isOnCooldown } from '../../cache/cooldown';
// UTILS: Embeds
import { Embed } from '../../utils/embed';
// UTILS: Runescape name validator
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';
import { CommandCooldowns } from '../../utils/osrs/enums';

export const osrsfetch = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const cooldown: number = CommandCooldowns.OSRSFETCH;
  const nameCheck: string = runescapeNameValidator(args);
  if (nameCheck === invalidRSN) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  if (isOnCooldown(msg, commandName, cooldown, true, username) === true) return;
  else {
    const isPlayerFetched: boolean = await fetchOsrsStats(msg, username);

    if (isPlayerFetched === true) {
      const embed: Embed = new Embed();
      embed.setDescription(
        `Fetched latest data available for player:\`\`\`${username}\`\`\``
      );
      return msg.channel.send(embed);
    } else msg.channel.send(errorHandler());
  }
};
