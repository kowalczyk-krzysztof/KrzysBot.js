import { Message } from 'discord.js';
import { createCommandList } from '../utils/createCommandList';

export const commands = async (
  msg: Message,
  ...args: string[]
): Promise<void> => {
  return createCommandList(msg, args);
};
