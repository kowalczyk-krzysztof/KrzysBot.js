// Discord
import { Message } from 'discord.js';
// Dotenv
import dotenv from 'dotenv';
// Axios
import axios, { AxiosResponse } from 'axios';
// UTILS: Argument parser
import { argumentParser } from '../utils/argumentParser';
// UTILS: Error handler
import { errorHandler } from '../utils/errorHandler';

dotenv.config({ path: 'config.env' });

// Tenor auth key
const key: string = process.env.TENOR_KEY as string;
/* (values: off | low | medium | high) specify the content safety filter level
  eventually ill make a seperate command for sfw or nsfw or just let user provide safe level
 */
const filter: string = 'off';

export const tenor = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message> => {
  if (args.length === 0) return msg.channel.send('Provide a keyword');
  const keyword: string = argumentParser(args);
  const url: string = `https://api.tenor.com/v1/search?q=${keyword}&key=${key}&contentfilter=${filter}`;
  try {
    const res: AxiosResponse = await axios.get(`${url}`);
    if (res.data.results.length === 0)
      return msg.channel.send('No results found');
    const index: number = Math.floor(Math.random() * res.data.results.length);
    return msg.channel.send(res.data.results[index].url);
  } catch (err) {
    return msg.channel.send(errorHandler(err));
  }
};
