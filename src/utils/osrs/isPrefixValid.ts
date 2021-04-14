import { Message } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config({ path: 'config.env' });

const BOSS_LIST = process.env.OSRS_BOSS_LIST;

export const isPrefixValid = (
  msg: Message,
  inputArgument: string[],
  inputTypes: string[],
  inputCategory: string
): string | null => {
  const category = inputCategory;
  const types = inputTypes;
  const typesList = types.join(', ');
  if (inputArgument.length === 0) {
    msg.channel.send(`Invalid ${category} type. Valid types: **${typesList}**`);
    return null;
  } else if (!types.includes(inputArgument[0].toLowerCase().trim())) {
    if (category === 'boss')
      msg.channel.send(`Invalid boss name. Valid boss names: <${BOSS_LIST}>`);
    else
      msg.channel.send(
        `Invalid ${category} type. Valid types: **${typesList}**`
      );

    return null;
  } else return inputArgument[0].toLowerCase().trim();
};
