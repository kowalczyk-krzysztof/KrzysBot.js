// Discord
import { Message } from 'discord.js';
// TempleOSRS Cache
import { playerNames, fetchTemple } from '../../cache/templeCache';
// UTILS: Embeds
import { Embed, ErrorEmbed, TempleEmbed } from '../../utils/embed';
// UTILS: Interfaces
import { TemplePlayerNames } from '../../utils/osrs/interfaces';
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

export const rsn = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const nameCheck: string = runescapeNameValidator(args);
  if (nameCheck === invalidRSN) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
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
  if (playerObject === undefined || playerObject === null)
    return errorHandler();
  else {
    const names: string[] = [];
    for (const alias in playerObject[TempleOther.ALIASES]) {
      names.push(alias);
    }
    const data: string = names.join('\n');
    embed.addField('Names', `${data}`);
    return embed;
  }
};
