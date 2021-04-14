import { Message } from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { argsToString } from '../../utils/argsToString';
import { runescapeNameValidator } from '../../utils/osrs/runescapeNameValidator';
import { isOnCooldown } from '../../cache/cooldown';
import { errorHandler } from '../../utils/errorHandler';
import { Embed } from '../../utils/embed';

dotenv.config({ path: 'config.env' });

export const datapoint = async (
  msg: Message,
  ...args: string[]
): Promise<Message | undefined> => {
  const cooldown: number = 1800;
  const nameCheck: boolean = runescapeNameValidator(...args);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const keyword: string = argsToString(...args);
  if (isOnCooldown(msg, cooldown, true, keyword) == true) return;
  else {
    try {
      const res: AxiosResponse = await axios.get(
        `${process.env.TEMPLE_DATA_POINT}${keyword}`
      );

      if (res.status === 200) {
        const embed: Embed = new Embed();
        const data: string = res.data.toString();
        const notOnHiscores: string =
          '<p style="text-align: center; color: black;"> Name not found on hiscores </p>';
        const recentlyUpdated: string =
          '<p style="text-align: center; color: black;"> User has already been updated in the last 60 seconds. </p>';
        if (data.includes(notOnHiscores)) {
          embed.setDescription(
            `Player **${keyword}** was not found on hiscores`
          );
          return msg.channel.send(embed);
        } else if (data.includes(recentlyUpdated)) {
          embed.setDescription(
            `Player **${keyword}** has already been updated in the last 60 seconds`
          );
          return msg.channel.send(embed);
        } else {
          embed.setDescription(`Updated datapoints for player: **${keyword}**`);
          return msg.channel.send(embed);
        }
      } else return errorHandler(null, msg);
    } catch (err) {
      return errorHandler(err, msg);
    }
  }
};
