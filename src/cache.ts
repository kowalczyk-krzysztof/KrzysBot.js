import { Message } from 'discord.js';
import dotenv from 'dotenv';
import { aliasHandler } from './commandHandler';

dotenv.config({ path: 'config.env' });
const prefix: string = process.env.PREFIX as string;

// Object which contains keys with names in format user.id + command name. The value for each key is date when it was created
const cache: { [key: string]: number } = {};
// Creates cache item (string)
const createCacheItem = (msg: Message): string => {
  const content: string[] = msg.content.slice(prefix.length).split(/ +/);
  const commandName: string = content[0];
  // I need to use alias handler here too otherwise I would generate two different keys because it creates the command name based on msg.content which will always be original message
  const command: string = aliasHandler(commandName);
  const cacheItem: string = msg.author.id + command;
  return cacheItem;
};

// Generates cache item, then checks if it exists in cache. If true, sends a msng to user with time left and returns true. If item is not in cache, add it to cache and return false
export const setCooldown = (msg: Message, cooldownInSec: number): boolean => {
  const cooldown: number = cooldownInSec;
  const message: Message = msg;

  // Adds item to cache and sets a timer on when to delete it
  const addCacheItem = (cacheItem: string, cooldownInSec: number): void => {
    const cooldownInMs: number = cooldownInSec * 1000;
    const item: string = cacheItem;
    cache[item] = Date.now();
    setTimeout(() => {
      delete cache[item];
    }, cooldownInMs);
  };

  const cacheItem: string = createCacheItem(message);

  if (cacheItem in cache) {
    const addedToCache: number = cache[cacheItem];
    const now: number = Date.now();

    const timeLeft: number = parseInt(
      (cooldown - (now - addedToCache) / 1000).toString()
    );

    msg.channel.send(
      `You have used this command recently. Please wait ${timeLeft}s and try again.`
    );
    return true;
  } else {
    addCacheItem(cacheItem, cooldown);
    return false;
  }
};
