import { Message } from 'discord.js';
import dotenv from 'dotenv';
import { aliasHandler } from '../commandHandler';
import { Embed } from '../utils/embed';

dotenv.config({ path: 'config.env' });
const prefix: string = process.env.PREFIX as string;

// Object which contains keys with names in format user.id + command name. The value for each key is date when it was created
const cache: { [key: string]: number } = {};
// Generates cache item, then checks if it exists in cache. If true, sends a msng to user with time left and returns true. If item is not in cache, add it to cache and return false
export const isOnCooldown = (
  msg: Message,
  cooldownInSec: number,

  authorOptional: boolean = false,
  keyword: string = ''
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
    const timeLeftSecondsDecimal = cooldown - (now - addedToCache) / 1000;
    const timeLeftSeconds: number = parseInt(timeLeftSecondsDecimal.toString());
    const timeLeftMinDecimal: number = timeLeftSeconds / 60;
    const timeLeftMin: number = parseInt(timeLeftMinDecimal.toString());
    const embed: Embed = new Embed();
    if (isAuthorOptional == false) {
      if (timeLeftSecondsDecimal > 60) {
        embed.setDescription(
          `You have used this command recently. Please wait **${timeLeftMin} min** and try again`
        );
        msg.channel.send(embed);
      } else if (timeLeftSecondsDecimal >= 1) {
        embed.setDescription(
          `You have used this command recently. Please wait **${timeLeftSeconds} s** and try again`
        );
        msg.channel.send(embed);
      } else {
        embed.setDescription(
          `You have used this command recently. Please wait **${timeLeftSecondsDecimal} s** and try again`
        );
        msg.channel.send(embed);
      }
    } else {
      if (timeLeftSecondsDecimal > 60) {
        embed.setDescription(
          `This command has been used recently. Please wait **${timeLeftMin} min** and try again`
        );
        msg.channel.send(embed);
      } else if (timeLeftSecondsDecimal >= 1) {
        embed.setDescription(
          `This command has been used recently. Please wait **${timeLeftSeconds}s** and try again`
        );
        msg.channel.send(embed);
      } else {
        embed.setDescription(
          `This command has been used recently. Please wait **${timeLeftSecondsDecimal}s** and try again`
        );
        msg.channel.send(embed);
      }
    }
    return true;
  } else {
    addCacheItem(cacheItem, cooldown);
    return false;
  }
};
