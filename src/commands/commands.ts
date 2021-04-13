import { Message } from 'discord.js';
import { CommandList, createCommandList } from '../utils/createCommandList';
import { setCooldown, hasCooldown } from '../cache';

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

export const commands = async (msg: Message): Promise<Message | undefined> => {
  const cooldown: number = 60;
  if (hasCooldown(msg, 60) === true) return;
  else {
    setCooldown(msg, cooldown);
    const commands = createCommandList(tenor, ehp, ehb, rsn, playercountry);
    return msg.channel.send(commands);
  }
};
