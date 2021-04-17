import { Message } from 'discord.js';
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
import { fetchOsrsStats } from '../../cache/osrsCache';
import { isOnCooldown } from '../../cache/cooldown';
import { Embed } from '../../utils/embed';
import { errorHandler } from '../../utils/errorHandler';

export const osrsfetch = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const cooldown: number = 600;
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
    } else return errorHandler(null, msg);
  }
};
