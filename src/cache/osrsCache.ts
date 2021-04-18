// Discord
import { Message } from 'discord.js';
// Dotenv
import dotenv from 'dotenv';
// Axios
import axios, { AxiosResponse } from 'axios';
// UTILS: Embeds
import { Embed } from '../utils/embed';
// UTILS: Interfaces
import { OsrsPlayer } from '../utils/osrs/interfaces';
// UTILS: Error handler
import { errorHandler } from '../utils/errorHandler';
// UTILS: Osrs data parser
import { osrsDataParser } from '../utils/osrs/osrsDataParser';

dotenv.config({ path: 'config.env' });
// URL
const HISCORE_API: string = process.env.OSRS_HISCORE_API as string;
// Max cache size
const maxCacheSize: number = 1000;
// Cache
export let osrsStats: { [key: string]: OsrsPlayer } = {};

// Fetch data
export const fetchOsrsStats = async (
  msg: Message,
  playerName: string
): Promise<boolean> => {
  const keyword: string = playerName;
  try {
    const res: AxiosResponse = await axios.get(`${HISCORE_API}${keyword}`);
    const data: OsrsPlayer = osrsDataParser(res.data);
    setOsrsStats(keyword, data);
    return true;
  } catch (err) {
    if (err.response.status === 404) {
      msg.channel.send(
        new Embed().addField('ERROR', `Player **${keyword}** not found`)
      );
    } else errorHandler(msg, err);
    return false;
  }
};
// Cache result
const setOsrsStats = (username: string, data: OsrsPlayer): void => {
  if (Object.keys(osrsStats).length > maxCacheSize) osrsStats = {};
  osrsStats[username] = data;
};
