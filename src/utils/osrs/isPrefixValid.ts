// Discord
import { Message } from 'discord.js';
// Dotenv
import dotenv from 'dotenv';
// UTILS: Embeds
import { Embed } from '../embed';

dotenv.config({ path: 'config.env' });

// Pastebins with valid boss and skill names
const BOSS_LIST: string = process.env.OSRS_BOSS_LIST as string;
const SKILL_LIST: string = process.env.OSRS_SKILL_LIST as string;

// TODO improve this
export enum PrefixCategories {
  BOSS = 'boss',
  BOSS_EDGE_CASE = 'bossedge',
  SKILL = 'skill',
  CLUES = 'clues',
  BH = 'bh',
  GAINS = 'gains',
  TIME = 'time',
  TIME_OTHER = 'timeother',
  OTHER = 'other',
  EMPTY = '',
}

export const invalidPrefix = 'INVALID';

export const isPrefixValid = (
  msg: Message,
  args: string[],
  types: string[],
  category: PrefixCategories
): string => {
  const typesList: string = types.join(', ');
  const parsedArgument: string = args[0]
    .replace(/\n/g, '')
    .toLowerCase()
    .trim();
  if (args.length === 0 || !types.includes(parsedArgument)) {
    msg.channel.send(invalidPrefixMsg(category, typesList));
    return invalidPrefix;
  } else return parsedArgument;
};
// Generate msg
export const invalidPrefixMsg = (
  category: PrefixCategories,
  types: string
): Embed => {
  let result;
  if (category === PrefixCategories.BOSS) {
    result = `Invalid boss name. Valid boss names: <${BOSS_LIST}>`;
  } else if (category === PrefixCategories.BOSS_EDGE_CASE)
    result = `Invalid boss name or username. Valid boss names: <${BOSS_LIST}>`;
  else if (category === PrefixCategories.SKILL)
    result = `Invalid skill name. Valid skill names: <${SKILL_LIST}>`;
  else if (category === PrefixCategories.TIME_OTHER)
    result = `Invalid ${category} type. Valid types: **${types}**\n\nFor LMS there is no 6h record`;
  else result = `Invalid ${category} type. Valid types: **${types}**`;
  return new Embed().setDescription(result);
};
