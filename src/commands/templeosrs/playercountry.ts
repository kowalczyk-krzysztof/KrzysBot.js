import axios, { AxiosResponse } from 'axios';
import { Message } from 'discord.js';
// Utils
import { runescapeNameValidator } from '../../utils/runescapeNameValidator';
import { stringOrArray } from '../../utils/stringOrArray';
import { TempleEmbed } from '../../utils/embed';

let localCache: { [key: string]: string } = {};

export const playercountry = async (
  msg: Message,
  ...args: string[]
): Promise<Message> => {
  const nameCheck: boolean = runescapeNameValidator(...args);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const keyword: string = stringOrArray(...args);
  if (Object.keys(localCache).length > 100) localCache = {};

  if (keyword in localCache) {
    const result = localCache[keyword];
    const embed: TempleEmbed = new TempleEmbed().addField(
      'Username',
      `${args}`
    );
    return msg.channel.send(embed.addField('Country', `${result}`));
  } else {
    try {
      const res: AxiosResponse = await axios.get(
        `https://templeosrs.com/api/player_info.php?player=${keyword}`
      );
      if (res.data.error) {
        if (res.data.error.Code === 402)
          return msg.channel.send('Player not found');
        else return msg.channel.send('Error');
      } else if (!res.data.error) {
        const country: string = res.data.data.Country;

        const embed: TempleEmbed = new TempleEmbed().addField(
          'Username',
          `${args}`
        );

        if (country === '-') {
          localCache[keyword] = 'No info';
          return msg.channel.send(embed.addField('Country', 'No info'));
        } else {
          localCache[keyword] = country;
          return msg.channel.send(embed.addField('Country', `${country}`));
        }
      } else return msg.channel.send('Error');
    } catch (err) {
      return msg.channel.send('Error');
    }
  }
};
