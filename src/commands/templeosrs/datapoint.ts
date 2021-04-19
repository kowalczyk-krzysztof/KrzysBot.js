// Discord
import { Message } from 'discord.js';
// Dotenv
import dotenv from 'dotenv';
// Axios
import axios, { AxiosResponse } from 'axios';
// Cooldown cache
import { isOnCooldown, cache, isInCache } from '../../cache/cooldown';
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
import { CommandCooldowns } from '../../utils/osrs/enums';

dotenv.config({ path: 'config.env' });

let lastFetchedCache: { [key: string]: number } = {};

const TEMPLE_OVERVIEW: string = process.env.TEMPLE_OVERVIEW as string;
const TEMPLE_DATA_POINT: string = process.env.TEMPLE_DATA_POINT as string;
// TODO: Switch to player_info once cooldown has been added
// First query player_info and see if player updating is on cooldown (if not, cooldown is displayed as "-" ) then add a cooldown on command === res.data.data.cooldown (so, cooldown on temple site). Then after this cooldown passes, command can be used again, then if there is no cooldown a data point is added then command is put on cooldown for CommandCooldowns.DATAPOINTS
export const datapoint = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined | void> => {
  const nameCheck: string = runescapeNameValidator(args);
  if (nameCheck === invalidRSN) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  const cacheItem: string = commandName + username.toLowerCase();
  if (cacheItem in cache)
    return isInCache(msg, cacheItem, CommandCooldowns.DATAPOINTS, true);
  const embed: Embed = new Embed();
  if (username in lastFetchedCache) {
    const timeWhenAddedToCache: number = lastFetchedCache[username];
    const now: number = Date.now();
    const timeLeftSecondsDecimal: number = (timeWhenAddedToCache - now) / 1000;
    const timeLeftSeconds: number = parseInt(timeLeftSecondsDecimal.toString());
    return msg.channel.send(
      embed.setDescription(
        `Player **${username}** has already been updated recently, if you still want to add a new datapoint, please wait **${timeLeftSeconds}s** and try again`
      )
    );
  } else {
    let cooldown: number;
    try {
      const res: AxiosResponse = await axios.get(
        `${TEMPLE_OVERVIEW}${username}`
      );
      if (res.data.error) {
        if (res.data.error.Code === 402) {
          const embed: Embed = new Embed();
          embed.addField(
            'ERROR',
            `Player **${username}** was not found on hiscores`
          );
        } else msg.channel.send(errorHandler(res.data.error));
      } else if (res.data.data.info.cooldown !== '-') {
        cooldown = parseInt(
          res.data.data.info.cooldown.charAt(0) +
            res.data.data.info.cooldown.charAt(1)
        );
        const secToMs: number = cooldown * 1000;
        lastFetchedCache[username] = Date.now() + secToMs;
        setTimeout(() => {
          delete lastFetchedCache[username];
        }, secToMs);
        embed.setDescription(
          `Player **${username}** has already been updated recently, if you still want to add a new datapoint, please wait **${cooldown}s** and try again`
        );
        return msg.channel.send(embed);
      } else {
        cooldown = CommandCooldowns.DATAPOINTS;
        if (
          isOnCooldown(
            msg,
            commandName,
            CommandCooldowns.DATAPOINTS,
            true,
            username
          ) === true
        )
          return;
        try {
          const res: AxiosResponse = await axios.get(
            `${TEMPLE_DATA_POINT}${username}`
          );
          if (res.status === 200) {
            embed.setDescription(
              `Updated datapoints for player: \`\`\`${username}\`\`\``
            );
            return msg.channel.send(embed);
          } else {
            return msg.channel.send(errorHandler());
          }
        } catch (err) {
          return msg.channel.send(errorHandler(err));
        }
      }
    } catch (err) {
      return msg.channel.send(errorHandler(err));
    }
  }
};
