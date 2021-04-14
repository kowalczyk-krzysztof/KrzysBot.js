import { Message } from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { stringOrArray } from '../../utils/stringOrArray';
import { runescapeNameValidator } from '../../utils/runescapeNameValidator';
import { isOnCooldown } from '../../cache/cooldown';

dotenv.config({ path: 'config.env' });

export const datapoint = async (
  msg: Message,
  ...args: string[]
): Promise<Message | undefined> => {
  const cooldown: number = 1800;
  const nameCheck: boolean = runescapeNameValidator(...args);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const keyword: string = stringOrArray(...args);
  if (isOnCooldown(msg, cooldown, keyword, true) == true) return;
  else {
    try {
      const res: AxiosResponse = await axios.get(
        `${process.env.TEMPLE_DATA_POINT}${keyword}`
      );

      if (res.status === 200) {
        const data: string = res.data.toString();
        const notOnHiscores: string =
          '<p style="text-align: center; color: black;"> Name not found on hiscores </p>';
        const recentlyUpdated: string =
          '<p style="text-align: center; color: black;"> User has already been updated in the last 60 seconds. </p>';
        if (data.includes(notOnHiscores))
          return msg.channel.send(
            `Player **${keyword}** not found on hiscores`
          );
        else if (data.includes(recentlyUpdated))
          return msg.channel.send(
            `Player **${keyword}** has already been updated in the last 60 seconds`
          );
        else
          return msg.channel.send(
            `Datapoints for player **${keyword}** have been updated`
          );
      }
    } catch (err) {
      return msg.channel.send('Error');
    }
  }
};
