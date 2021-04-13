// Dotenv
import dotenv from 'dotenv';
// Discord
import { Message } from 'discord.js';
// Commands: random
import { commands } from './commands/commands';
import { tenor } from './commands/tenor';
// Commands: TempleOSRS
import { ehp } from './commands/templeosrs/ehp';
import { ehb } from './commands/templeosrs/ehb';
import { rsn } from './commands/templeosrs/rsn';
import { playercountry } from './commands/templeosrs/playercountry';
// Dotenv config
dotenv.config({ path: 'config.env' });
// Command prefix
const prefix: string = process.env.PREFIX as string;
// List of commands
export const commandList: {
  [key: string]: (
    msg: Message,
    ...args: string[]
  ) => Promise<Message | undefined>;
} = {
  commands,
  tenor,
  ehp,
  ehb,
  rsn,
  playercountry,
};
// Alias handler
// Take a command name and check if it has an alias then return the original name
const aliasHandler = (commandName: string) => {
  if (commandName === 'help') return 'commands';
  else return commandName;
};

// Command handler
export const commandHandler = (msg: Message) => {
  // If msg doesn't start with prefix or author is bot return
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  // msg.content is a string, slice the prefix then remove whitespace
  const content: string[] = msg.content.slice(prefix.length).split(/ +/);
  // first index is the command
  const commandName: string = content[0];
  const command: string = aliasHandler(commandName);
  // if (cooldownHandler(msg, command) === true) return msg.channel.send('Bye');
  // if there is no command with name = command return, else execute the command and pass msg (so I can get properties like author, etc) and args (string[])
  // in keyword  checks if a key exists on an object returns a boolean
  if (command in commandList === false) return;
  else {
    // args is anything after the command
    const args: string[] = content.slice(1);
    commandList[command](msg, ...args);
  }
};
