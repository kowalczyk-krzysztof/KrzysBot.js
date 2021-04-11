import dotenv from 'dotenv';
import { Message } from 'discord.js';
// Commands
import { tenor } from './commands/tenor';

dotenv.config({ path: 'config.env' });
// Command prefix
const prefix: string = process.env.PREFIX as string;

// List of commands, type has to be any unfortunately
const commands: any = {
  tenor,
};

export const commandHandler = (msg: Message) => {
  // If msg doesn't start with prefix or author is bot return
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  // msg.content is a string, slice the prefix then remove whitespace
  const content: string[] | number[] = msg.content
    .slice(prefix.length)
    .split(/ +/);
  // first index is the command
  const command: string | number = content[0];
  // if there is no command with name = content[0] return, else execute the command and pass msg (so I can get properties like author, etc) and args (array of strings or numbers)
  if (!commands[command]) return;
  else {
    // args is anything after the command
    const args: string[] | number[] = content.slice(1);
    commands[command](msg, ...args);
  }
};
