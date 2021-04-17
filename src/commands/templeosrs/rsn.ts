import { Message } from 'discord.js';
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
import { Embed } from '../../utils/embed';
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
  const nameCheck: string | null = runescapeNameValidator(args);
  if (nameCheck === null) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  const embed: Embed = new Embed().setFooter(
    'Incorrect? Fetch latest names:\n.fetchrsn username'
  );
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
  inputEmbed: Embed,
  playerObject: PlayerNames
): Embed => {
  const embed: Embed = inputEmbed;
  const aliases = playerObject.aliases;
  const names: string[] = [];
  for (const alias in aliases) {
    names.push(alias);
  }
  const data: string = names.join('\n');
  embed.addField('Names', `${data}`);
  return embed;
};
