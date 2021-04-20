// Discord
import { Message } from 'discord.js';
// Dotenv
import dotenv from 'dotenv';
// Commands: Command List
import { commands } from './commands/commands';
// Commands: TempleOSRS
import { ehp } from './commands/templeosrs/ehp';
import { ehb } from './commands/templeosrs/ehb';
import { rsn } from './commands/templeosrs/rsn';
import { playercountry } from './commands/templeosrs/playercountry';
import { templefetch } from './commands/templeosrs/templefetch';
import { datapoint } from './commands/templeosrs/datapoint';
import { record } from './commands/templeosrs/record';
import { gains } from './commands/templeosrs/gains';
import { topboss } from './commands/templeosrs/topsboss';
import { topskill } from './commands/templeosrs/topskill';
// Commands: OSRS
import { clues } from './commands/osrs/clues';
import { kc } from './commands/osrs/kc';
import { lvl } from './commands/osrs/lvl';
import { osrsfetch } from './commands/osrs/osrsfetch';
import { lms } from './commands/osrs/lms';
import { bh } from './commands/osrs/bh';
import { soulwars } from './commands/osrs/soulwars';
import { leaguepoints } from './commands/osrs/leaguepoints';
// UTILS: Embeds
import { ErrorEmbed } from './utils/embed';

dotenv.config({ path: 'config.env' });
// Command prefix
const prefix: string = process.env.PREFIX as string;
// List of commands
export const commandList: {
  [key: string]: (
    msg: Message,
    ...args: string[]
  ) => Promise<Message | undefined | void | ErrorEmbed>;
} = {
  commands,
  ehp,
  ehb,
  rsn,
  playercountry,
  templefetch,
  datapoint,
  clues,
  kc,
  lvl,
  osrsfetch,
  lms,
  bh,
  soulwars,
  leaguepoints,
  record,
  gains,
  topboss,
  topskill,
};
// Alias handler - take a command name and check if it has an alias then return the original name
export const aliasHandler = (commandName: string) => {
  const alias: string = commandName.toLowerCase();
  switch (alias) {
    case 'help':
      return 'commands';
    case 'fetchtemple':
      return 'templefetch';
    case 'fetchosrs':
      return 'osrsfetch';
    case 'leaguepts':
      return 'leaguepoints';
    default:
      return alias;
  }
};
// Command handler
export const commandHandler = async (msg: Message) => {
  // If msg doesn't start with prefix or author is bot return
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  // msg.content is a string, slice the prefix then remove whitespace
  const content: string[] = msg.content.slice(prefix.length).split(/ +/);
  // first index is the command
  const commandName: string = content[0];
  const command: string = aliasHandler(commandName);
  // if there is no command with name = command return, else execute the command and pass msg (so I can get properties like author, etc) and args (string[])
  // in keyword  checks if a key exists on an object returns a boolean
  if (command in commandList === false) return;
  else {
    // args is anything after the command
    const args: string[] = content.slice(1);
    await commandList[command](msg, command, ...args);
  }
};
