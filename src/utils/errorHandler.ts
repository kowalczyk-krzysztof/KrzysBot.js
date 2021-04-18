// Discord
import { Message } from 'discord.js';
// Dotenv
import dotenv from 'dotenv';
// UTILS: Embeds
import { ErrorEmbed } from './embed';

dotenv.config({ path: 'config.env' });
// Env status
const env: string = process.env.NODE_ENV as string;
// TODO: Make this good
export const errorHandler = (
  msg: Message,
  err: any = null
): Promise<Message> => {
  const embed: ErrorEmbed = new ErrorEmbed();
  if (env === 'development') console.log(err);
  return msg.channel.send(embed);
};
