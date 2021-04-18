// Discord
import { Message } from 'discord.js';
// Dotenv
import dotenv from 'dotenv';
// Axios
import axios, { AxiosResponse } from 'axios';
// Cooldown cache
import { isOnCooldown } from '../../cache/cooldown';
// UTILS: Embeds
import { Embed } from '../../utils/embed';
// UTILS: Runescape name validator
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';

dotenv.config({ path: 'config.env' });

export const datapoint = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const cooldown: number = 1800;
  const nameCheck: string = runescapeNameValidator(args);
  if (nameCheck === invalidRSN) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  if (isOnCooldown(msg, commandName, cooldown, false, username) === true)
    return;
  else {
    try {
      const res: AxiosResponse = await axios.get(
        `${process.env.TEMPLE_DATA_POINT}${username}`
      );
      if (res.status === 200) {
        const embed: Embed = new Embed();
        const data: string = res.data.toString();
        // There's no API endpoint for this, I have to improvise
        const notOnHiscores: string =
          '<p style="text-align: center; color: black;"> Name not found on hiscores </p>';
        const recentlyUpdated: string =
          '<p style="text-align: center; color: black;"> User has already been updated in the last 60 seconds. </p>';
        if (data.includes(notOnHiscores)) {
          embed.setDescription(
            `Player **${username}** was not found on hiscores`
          );
          return msg.channel.send(embed);
        } else if (data.includes(recentlyUpdated)) {
          embed.setDescription(
            `Player **${username}** has already been updated in the last 60 seconds`
          );
          return msg.channel.send(embed);
        } else {
          embed.setDescription(
            `Updated datapoints for player: **${username}**`
          );
          return msg.channel.send(embed);
        }
      } else return errorHandler(msg);
    } catch (err) {
      return errorHandler(msg, err);
    }
  }
};
