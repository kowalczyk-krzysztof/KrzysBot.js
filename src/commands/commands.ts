// Discord
import { Message } from 'discord.js';
// Cooldown cache
import { isOnCooldown } from '../cache/cooldown';
// UTILS: Create commands list
import { createCommandList } from '../utils/createCommandList';

export const commands = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<void> => {
  const cooldown: number = 60;
  if (
    isOnCooldown(msg, commandName, cooldown, false, args.join('').toLowerCase())
  )
    return;
  else return createCommandList(msg, args);
};
