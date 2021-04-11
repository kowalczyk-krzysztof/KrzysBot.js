import axios from 'axios';
import dotenv from 'dotenv';
import { Message } from 'discord.js';

dotenv.config({ path: 'config.env' });

const key: string = process.env.TENOR_KEY as string;

export const tenor = async (msg: Message, ...args: string[] | number[]) => {
  if (args.length === 0) return msg.channel.send('Provide a keyword');

  const keyword: string | number = args[0];

  const url = `https://api.tenor.com/v1/search?q=${keyword}&key=${key}&contentfilter=high`;
  try {
    const res = await axios.get(`${url}`);

    const index = Math.floor(Math.random() * res.data.results.length);
    msg.channel.send(res.data.results[index].url);
  } catch (err) {
    console.log(err);
  }
};
