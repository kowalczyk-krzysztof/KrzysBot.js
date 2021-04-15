import { Message } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config({ path: 'config.env' });

const BOSS_LIST = process.env.OSRS_BOSS_LIST;
const SKILL_LIST = process.env.OSRS_SKILL_LIST;

export enum Categories {
  BOSS = 'boss',
  SKILL = 'skill',
  CLUES = 'clues',
  BH = 'bh',
}

export const isPrefixValid = (
  msg: Message,
  inputArgument: string[],
  inputTypes: string[],
  inputCategory: Categories
): string | null => {
  const category = inputCategory;
  const types = inputTypes;
  const typesList = types.join(', ');
  if (inputArgument.length === 0) {
    msg.channel.send(`Invalid ${category} type. Valid types: **${typesList}**`);
    return null;
  } else if (!types.includes(inputArgument[0].toLowerCase().trim())) {
    if (category === Categories.BOSS)
      msg.channel.send(`Invalid boss name. Valid boss names: <${BOSS_LIST}>`);
    if (category === Categories.SKILL)
      msg.channel.send(
        `Invalid skill name. Valid skill names: <${SKILL_LIST}>`
      );
    else
      msg.channel.send(
        `Invalid ${category} type. Valid types: **${typesList}**`
      );

    return null;
  } else return inputArgument[0].toLowerCase().trim();
};
