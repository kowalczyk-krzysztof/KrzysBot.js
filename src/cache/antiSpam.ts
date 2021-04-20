// Discord
import { Message } from 'discord.js';

const spamCache: { [key: string]: null } = {};

/* Add author.id + commandName to spamCache then delete if after cooldownInMs. In command put an if statement at the very beggining.

if (antispam(msg, commandName) === true) return

This will prevent people from spamming the command

*/
export const antiSpam = (
  msg: Message,
  commandName: string
): boolean | undefined => {
  const cooldownInMs: number = 3000;
  const cacheItem: string = msg.author.id + commandName;
  if (cacheItem in spamCache) return true;
  spamCache[cacheItem] = null;
  setTimeout(() => {
    delete spamCache[cacheItem];
  }, cooldownInMs);
};
