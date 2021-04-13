import { Message } from 'discord.js';
import { CommandList, createCommandList } from '../utils/createCommandList';
import { setCooldown } from '../cache';

// List of all commands
const tenor = new CommandList(
  'tenor',
  'Search for a random image with provided keyword',
  '.tenor cat'
);
const ehp = new CommandList('ehp', `Get player's EHP`, '.ehp zezima');
const ehb = new CommandList('ehb', `Get player's EHB`, '.ehb zezima');
const rsn = new CommandList(
  'rsn',
  `Get a list of player's current and previous usernames`,
  '.rsn zezima'
);
const playercountry = new CommandList(
  'playercountry',
  `Get player's country of origin`,
  '.playercountry zezima'
);
// TODO: As command list grows, it would be wise to split them into categories and make it so if .commands has no args then returns a list of categories and if commands has args for example ".commands osrs" then return commands from that category. Cooldown would have to be lowered too.
export const commands = async (msg: Message): Promise<Message | undefined> => {
  const cooldown: number = 60;
  if (setCooldown(msg, cooldown) === true) return;
  else {
    const commands = createCommandList(tenor, ehp, ehb, rsn, playercountry);
    return msg.channel.send(commands);
  }
};
