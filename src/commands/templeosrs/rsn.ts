// Discord
import { Message } from 'discord.js';
// TempleOSRS Cache
import { playerNames, fetchTemple } from '../../cache/templeCache';
// Cooldown cache
import { isOnCooldown } from '../../cache/cooldown';
// UTILS: Embeds
import { Embed, ErrorEmbed, TempleEmbed } from '../../utils/embed';
// UTILS: Interfaces
import { TemplePlayerNames } from '../../utils/osrs/interfaces';
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
import { antiSpam } from '../../cache/antiSpam';

export const rsn = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  if (antiSpam(msg, commandName) === true) return;
  const cooldown = CommandCooldowns.RSN;
  const username: string | undefined = runescapeNameValidator(args);
  if (!username) return msg.channel.send(invalidUsername);
  if (isOnCooldown(msg, commandName, cooldown, false, username) === true)
    return;
  const embed: TempleEmbed = new TempleEmbed();
  if (username in playerNames) {
    const result: Embed = generateResult(embed, playerNames[username]);
    return msg.channel.send(result);
  } else {
    const dataType: TempleCacheType = TempleCacheType.PLAYER_NAMES;
    const isFetched: boolean = await fetchTemple(msg, username, dataType);
    if (isFetched === true) {
      const result: Embed = generateResult(embed, playerNames[username]);
      return msg.channel.send(result);
    } else return;
  }
};
// Generates embed sent to user
const generateResult = (
  embed: TempleEmbed,
  playerObject: TemplePlayerNames
): TempleEmbed | ErrorEmbed => {
  if (!playerObject) return errorHandler();
  else {
    const names: string[] = [];
    for (const alias in playerObject[TempleOther.ALIASES]) {
      names.push(alias);
    }
    const data: string = names.join('\n');
    embed.addField('NAMES:', `\`\`\`${data}\`\`\``);
    return embed;
  }
};
