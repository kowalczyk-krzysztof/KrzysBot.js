import { Message } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config({ path: 'config.env' });
const prefix: string = process.env.PREFIX as string;

// Cache containing strings in format userid + command name + time
const cache: Set<string> = new Set();
// Creates cache item (string)
const createCacheItem = (msg: Message, cooldownInSec: number): string => {
  const time: string = cooldownInSec.toString();
  const content: string[] = msg.content.slice(prefix.length).split(/ +/);
  const commandName: string = content[0];
  const cacheItem: string = msg.author.id + commandName + time;
  return cacheItem;
};
// Adds items to cache and then removes it after specified time
export const setCooldown = (msg: Message, cooldownInSec: number): void => {
  const time: number = cooldownInSec;
  const message: Message = msg;

  // Adds item to cache
  const addCacheItem = (cacheItem: string): void => {
    const item: string = cacheItem;
    cache.add(item);
  };

  // Removes item from cache
  const deleteCacheItem = (cacheItem: string, cooldownInSec: number): void => {
    const item: string = cacheItem;
    const cooldownInMs: number = cooldownInSec * 1000;
    setTimeout(() => {
      cache.delete(item);
    }, cooldownInMs);
  };

  const cacheItem: string = createCacheItem(message, time);
  addCacheItem(cacheItem);
  deleteCacheItem(cacheItem, time);
};
// Check if command is on cooldown
export const hasCooldown = (msg: Message, timeInSec: number): boolean => {
  const message: Message = msg;
  const time: number = timeInSec;
  const item = createCacheItem(message, time);
  const hasItem = cache.has(item);

  if (hasItem === true) {
    msg.channel.send(
      `You have used this command recently. Please wait ${time}s and try again.`
    );
    return true;
  } else return false;
};
