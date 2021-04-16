import { Message } from 'discord.js';
import { Embed } from '../utils/embed';

// Object which contains keys with names in format user.id + command name. The value for each key is date when it was created
const cache: { [key: string]: number } = {};
// Generates cache item, then checks if it exists in cache. If true, sends a msng to user with time left and returns true. If item is not in cache, add it to cache and return false
export const isOnCooldown = (
  msg: Message,
  commandName: string,
  cooldownInSec: number,
  isAuthorOptional: boolean = false,
  optionalArgs: string = ''
): boolean => {
  // Creates cache item (string)
  const createCacheItem = (
    msg: Message,
    commandName: string,
    isAuthorOptional: boolean,
    optionalArgs: string
  ): string => {
    let keyword;
    if (optionalArgs !== '') keyword = optionalArgs.toLowerCase();
    else keyword = '';

    if (isAuthorOptional === false) {
      const cacheItem: string = msg.author.id + commandName + keyword;
      return cacheItem.toLowerCase();
    } else {
      const cacheItem: string = commandName + keyword;
      return cacheItem.toLowerCase();
    }
  };
  // Adds item to cache and sets a timer on when to delete it
  const addCacheItem = (cacheItem: string, cooldownInSec: number): void => {
    const cooldownInMs: number = cooldownInSec * 1000;
    const item: string = cacheItem;
    cache[item] = Date.now();
    setTimeout(() => {
      delete cache[item];
    }, cooldownInMs);
  };

  const cacheItem: string = createCacheItem(
    msg,
    commandName,
    isAuthorOptional,
    optionalArgs
  );
  if (cacheItem in cache) {
    const timeWhenAddedToCache: number = cache[cacheItem];
    const now: number = Date.now();
    const timeLeftSecondsDecimal: number =
      cooldownInSec - (now - timeWhenAddedToCache) / 1000;
    const timeLeftSeconds: number = parseInt(timeLeftSecondsDecimal.toString());
    const timeLeftMinDecimal: number = timeLeftSeconds / 60;
    const timeLeftMin: number = parseInt(timeLeftMinDecimal.toString());
    let time: number;
    let secondOrMin: string;
    if (timeLeftSecondsDecimal > 60) {
      time = timeLeftMin;
      secondOrMin = ' min';
    } else if (timeLeftSecondsDecimal >= 1) {
      time = timeLeftSeconds;
      secondOrMin = 's';
    } else {
      time = timeLeftSecondsDecimal;
      secondOrMin = 's';
    }
    const authorRequiredMsg: string = `You have used this command recently. Please wait **${time}${secondOrMin}** and try again`;
    const authorOptionalMsg: string = `This command has been used recently. Please wait **${time}${secondOrMin}** and try again`;
    let cooldownMsg: string;
    if (isAuthorOptional === false) cooldownMsg = authorRequiredMsg;
    else cooldownMsg = authorOptionalMsg;
    msg.channel.send(new Embed().setDescription(cooldownMsg));
    return true;
  } else {
    addCacheItem(cacheItem, cooldownInSec);
    return false;
  }
};
