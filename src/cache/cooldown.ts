import { Message } from 'discord.js';
import dotenv from 'dotenv';
import { aliasHandler } from '../commandHandler';

dotenv.config({ path: 'config.env' });
const prefix: string = process.env.PREFIX as string;

// Object which contains keys with names in format user.id + command name. The value for each key is date when it was created
const cache: { [key: string]: number } = {};
// Generates cache item, then checks if it exists in cache. If true, sends a msng to user with time left and returns true. If item is not in cache, add it to cache and return false
export const isOnCooldown = (
  msg: Message,
  cooldownInSec: number,
  keyword: string = '',
  authorOptional: boolean = false
): boolean => {
  const cooldown: number = cooldownInSec;
  const message: Message = msg;
  const optionalKeyword = keyword;
  const isAuthorOptional = authorOptional;

  // Creates cache item (string)
  const createCacheItem = (
    msg: Message,
    keyword: string = '',
    authorOptional: boolean
  ): string => {
    const isAuthorOptional = authorOptional;
    const content: string[] = msg.content.slice(prefix.length).split(/ +/);
    const commandName: string = content[0];
    // I need to use alias handler here too otherwise I would generate two different keys because it creates the command name based on msg.content which will always be original message
    const command: string = aliasHandler(commandName);
    const optionalKeyword = keyword;
    // For some commands I want to have shared cooldown, so I need this check
    if (isAuthorOptional === false) {
      const cacheItem: string = msg.author.id + command + optionalKeyword;
      return cacheItem.toLowerCase();
    } else {
      const cacheItem: string = command + optionalKeyword;
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
    message,
    optionalKeyword,
    isAuthorOptional
  );

  if (cacheItem in cache) {
    const addedToCache: number = cache[cacheItem];
    const now: number = Date.now();
    const timeLeftDecimal = cooldown - (now - addedToCache) / 1000;
    const timeLeft: number = parseInt(timeLeftDecimal.toString());

    if (isAuthorOptional == false) {
      if (timeLeftDecimal >= 1)
        msg.channel.send(
          `You have used this command recently. Please wait **${timeLeft}s** and try again`
        );
      else
        msg.channel.send(
          `You have used this command recently. Please wait **${timeLeftDecimal}s** and try again`
        );
    } else {
      if (timeLeftDecimal >= 1)
        msg.channel.send(
          `This command has been used recently. Please wait **${timeLeft}s** and try again`
        );
      else
        msg.channel.send(
          `This command has been used recently. Please wait **${timeLeftDecimal}s** and try again`
        );
    }
    return true;
  } else {
    addCacheItem(cacheItem, cooldown);
    return false;
  }
};
