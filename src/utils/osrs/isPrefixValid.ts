import { Message } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config({ path: 'config.env' });

export const BOSS_LIST: string = process.env.OSRS_BOSS_LIST as string;
const SKILL_LIST: string = process.env.OSRS_SKILL_LIST as string;

export enum Categories {
  BOSS = 'boss',
  SKILL = 'skill',
  CLUES = 'clues',
  BH = 'bh',
  GAINS = 'gains',
}

export const isPrefixValid = (
  msg: Message,
  inputArgument: string[],
  inputTypes: string[],
  inputCategory: Categories
): string | null => {
  const category: Categories = inputCategory;
  const types: string[] = inputTypes;
  const typesList: string = types.join(', ');
  const parsedArgument: string = inputArgument[0]
    .replace(/\n/g, '')
    .toLowerCase()
    .trim();

  if (inputArgument.length === 0) {
    msg.channel.send(`Invalid ${category} type. Valid types: **${typesList}**`);
    return null;
  } else if (!types.includes(parsedArgument)) {
    if (category === Categories.BOSS) {
      msg.channel.send(`Invalid boss name. Valid boss names: <${BOSS_LIST}>`);
    } else if (category === Categories.SKILL)
      msg.channel.send(
        `Invalid skill name. Valid skill names: <${SKILL_LIST}>`
      );
    else {
      msg.channel.send(
        `Invalid ${category} type. Valid types: **${typesList}**`
      );
    }

    return null;
  } else return parsedArgument;
};
