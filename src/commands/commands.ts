import { Message } from 'discord.js';
import { CommandList, createCommandList } from '../utils/createCommandList';

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
// Contains users who have used this command recently
const usedRecently = new Set();

export const commands = async (msg: Message): Promise<Message> => {
  if (usedRecently.has(msg.author.id))
    return msg.channel.send(
      `You have recently used this command. Wait 1 mintue before trying again.`
    );
  else {
    // Adds the user to the set so that they can't talk for a minute
    usedRecently.add(msg.author.id);
    setTimeout(() => {
      // Removes the user from the set after a minute
      usedRecently.delete(msg.author.id);
    }, 60000);
    // Creating command list
    const commands = createCommandList(tenor, ehp, ehb, rsn, playercountry);
    return msg.channel.send(commands);
  }
};
