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
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';
import { CommandCooldowns } from '../../utils/osrs/enums';
// Anti-spam
import { isSpamming } from '../../cache/antiSpam';

export const osrs = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  if (isSpamming(msg, commandName)) return;
  const cooldown: number = CommandCooldowns.OSRS;
  const username: string | undefined = runescapeNameValidator(args);
  if (!username) return msg.channel.send(invalidUsername);
  if (isOnCooldown(msg, commandName, cooldown, true, username)) return;
  const isPlayerFetched: boolean = await fetchOsrsStats(msg, username);
  if (isPlayerFetched)
    return msg.channel.send(
      new Embed().setDescription(
        `Fetched latest data available for player:\`\`\`${username}\`\`\``
      )
    );
  msg.channel.send(errorHandler());
};
