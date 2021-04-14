import { Message } from 'discord.js';
// Utils
import { runescapeNameValidator } from '../../utils/osrs/runescapeNameValidator';
import { argsToString } from '../../utils/argsToString';
import { TempleEmbed } from '../../utils/embed';
import { playerStats, fetchTemple, PlayerStats } from '../../cache/templeCache';

export const playercountry = async (
  msg: Message,
  ...args: string[]
): Promise<Message | undefined> => {
  const nameCheck: boolean = runescapeNameValidator(...args);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const keyword: string = argsToString(...args);
  const embed: TempleEmbed = new TempleEmbed().addField('Username', `${args}`);
  if (keyword in playerStats) {
    const result = generateEmbed(embed, playerStats[keyword]);
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchTemple(msg, keyword);
    if (isFetched === true) {
      const result = generateEmbed(embed, playerStats[keyword]);
      return msg.channel.send(result);
    } else return;
  }
};

// Generate result
const generateEmbed = (
  inputEmbed: TempleEmbed,
  playerObject: PlayerStats
): TempleEmbed => {
  const embed: TempleEmbed = inputEmbed;
  const data = playerObject.info.Country;
  if (data === '-') embed.addField('Country', 'No Info');
  else embed.addField('Country', `${data}`);
  return embed;
};
