// Discord
import { Message } from 'discord.js';
// Cooldown cache
import { isOnCooldown } from '../cache/cooldown';
// UTILS: Create commands list
import { createCommandList } from '../utils/createCommandList';
import { CommandCooldowns } from '../utils/osrs/enums';
// Anti-spam
import { antiSpam } from '../cache/antiSpam';

export const commands = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<void> => {
  if (antiSpam(msg, commandName) === true) return;
  const cooldown: number = CommandCooldowns.COMMAND_LIST;
  if (
    isOnCooldown(msg, commandName, cooldown, false, args.join('').toLowerCase())
  )
    return;
  else return createCommandList(msg, args);
};
