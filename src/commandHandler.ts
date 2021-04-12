// Dotenv
import dotenv from 'dotenv';
// Discord
import { Message } from 'discord.js';
// Commands
import { tenor } from './commands/tenor';
// Commands: TempleOSRS
import { ehp } from './commands/templeosrs/ehp';
import { ehb } from './commands/templeosrs/ehb';
import { rsn } from './commands/templeosrs/rsn';
// Dotenv config
dotenv.config({ path: 'config.env' });
// Command prefix
const prefix: string = process.env.PREFIX as string;
// List of commands
const commands: {
  [key: string]: (msg: Message, ...args: string[]) => Promise<Message>;
} = {
  tenor,
  ehp,
  ehb,
  rsn,
};
// Command handler
export const commandHandler = (msg: Message) => {
  // If msg doesn't start with prefix or author is bot return
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  // msg.content is a string, slice the prefix then remove whitespace
  const content: string[] = msg.content.slice(prefix.length).split(/ +/);
  // first index is the command
  const command: string = content[0];
  // if there is no command with name = content[0] return, else execute the command and pass msg (so I can get properties like author, etc) and args (string[])
  if (!commands[command]) return;
  else {
    // args is anything after the command
    const args: string[] = content.slice(1);
    commands[command](msg, ...args);
  }
};
