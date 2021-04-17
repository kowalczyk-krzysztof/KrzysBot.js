import { Message } from 'discord.js';
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
import { TempleEmbed, usernameString } from '../../utils/embed';
import {
  playerStats,
  CacheTypes,
  PlayerStats,
  fetchTemple,
} from '../../cache/templeCache';

export const playercountry = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const nameCheck: string | null = runescapeNameValidator(args);
  if (nameCheck === null) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  if (username in playerStats) {
    const result: TempleEmbed = generateResult(playerStats[username]);
    return msg.channel.send(result);
  } else {
    const dataType: CacheTypes = CacheTypes.PLAYER_STATS;
    const isFetched: boolean = await fetchTemple(msg, username, dataType);
    if (isFetched === true) {
      const result: TempleEmbed = generateResult(playerStats[username]);
      return msg.channel.send(result);
    } else return;
  }
};

// Generate result
const generateResult = (playerObject: PlayerStats): TempleEmbed => {
  const embed: TempleEmbed = new TempleEmbed().addField(
    usernameString,
    `${playerObject.info.Username}`
  );
  const data: string = playerObject.info.Country;
  if (data === '-') embed.addField('Country', 'No Info');
  else embed.addField('Country', `${data}`);
  return embed;
};
