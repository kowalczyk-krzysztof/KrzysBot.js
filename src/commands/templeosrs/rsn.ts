import { Message } from 'discord.js';
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
import { Embed, ErrorEmbed, TempleEmbed } from '../../utils/embed';
import {
  playerNames,
  CacheTypes,
  fetchTemple,
  PlayerNames,
} from '../../cache/templeCache';

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
    const dataType: CacheTypes = CacheTypes.PLAYER_NAMES;
    const isFetched: boolean = await fetchTemple(msg, username, dataType);
    if (isFetched === true) {
      const result: Embed = generateResult(embed, playerNames[username]);
      return msg.channel.send(result);
    } else return;
  }
};

// Generate result
const generateResult = (
  inputEmbed: TempleEmbed,
  playerObject: PlayerNames
): TempleEmbed | ErrorEmbed => {
  if (playerObject === undefined) return new ErrorEmbed();
  const names: string[] = [];
  for (const alias in playerObject.aliases) {
    names.push(alias);
  }
  const data: string = names.join('\n');
  inputEmbed.addField('Names', `${data}`);
  return inputEmbed;
};
