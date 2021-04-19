// Dotenv
import dotenv from 'dotenv';
// UTILS: Embeds
import { ErrorEmbed } from './embed';

dotenv.config({ path: 'config.env' });
// Env status
const env: string = process.env.NODE_ENV as string;
// TODO: Make this good
export const errorHandler = (err: any = null): ErrorEmbed => {
  const embed: ErrorEmbed = new ErrorEmbed();
  if (env === 'development') console.log(err);
  return embed;
};
