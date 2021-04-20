// Discord
import { Message } from 'discord.js';
// Dotenv
import dotenv from 'dotenv';
// Cooldown cache
import { isOnCooldown } from '../cache/cooldown';
// UTILS: Create commands list
// import { createCommandList } from '../utils/createCommandList';
import { CommandCooldowns } from '../utils/osrs/enums';
// Anti-spam
import { antiSpam } from '../cache/antiSpam';
import { Embed } from '../utils/embed';

dotenv.config({ path: 'config.env' });
const wiki: string = process.env.GITHUB_WIKI as string;

export const commands = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  if (antiSpam(msg, commandName) === true) return;
  const cooldown: number = CommandCooldowns.COMMAND_LIST;
  if (
    isOnCooldown(msg, commandName, cooldown, false, args.join('').toLowerCase())
  )
    return;
  else
    return msg.channel.send(
      new Embed().setDescription(
        `List of available commands with example usage:\n\n[Commands](${wiki} 'Commands')`
      )
    );
};
