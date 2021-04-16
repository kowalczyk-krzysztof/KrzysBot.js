import { Message } from 'discord.js';
import dotenv from 'dotenv';
import { Embed } from '../embed';

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
  const typesList: string = inputTypes.join(', ');
  const parsedArgument: string = inputArgument[0]
    .replace(/\n/g, '')
    .toLowerCase()
    .trim();
  if (inputArgument.length === 0 || !inputTypes.includes(parsedArgument)) {
    msg.channel.send(invalidPrefixMsg(inputCategory, typesList));

    return null;
  } else return parsedArgument;
};

export const invalidPrefixMsg = (
  category: Categories,
  types: string
): Embed => {
  let result;
  if (category === Categories.BOSS) {
    result = `Invalid boss name. Valid boss names: <${BOSS_LIST}>`;
  } else if (category === Categories.SKILL)
    result = `Invalid skill name. Valid skill names: <${SKILL_LIST}>`;
  else result = `Invalid ${category} type. Valid types: **${types}**`;
  return new Embed().setDescription(result);
};
