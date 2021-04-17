import dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';
import { Message } from 'discord.js';
import { Embed } from '../utils/embed';
import { errorHandler } from '../utils/errorHandler';

export let playerStats: { [key: string]: PlayerStats } = {};
export let playerNames: { [key: string]: PlayerNames } = {};
export let playerRecords: { [key: string]: PlayerRecords } = {};

dotenv.config({ path: 'config.env' });

const TEMPLE_LINK: string = process.env.TEMPLE_PLAYER_STATS as string;
const TEMPLE_PLAYER_NAMES: string = process.env.TEMPLE_PLAYER_NAMES as string;
const TEMPLE_RECORDS: string = process.env.TEMPLE_RECORDS as string;
const maxCacheSize: number = 1000;

export enum GameMode {
  MAIN = 0,
  IM = 1,
  UIM = 2,
  HCIM = 3,
}

interface PlayerInfo {
  Username: string;
  Country: string;
  'Game mode': GameMode;
  'Cb-3': number;
  F2p: number;
  Banned: number;
  Disqualified: number;
  'Clan preference': null | string;
  'Last checked': string;
  'Last changed': string;
}

export interface PlayerStats {
  Date: string;
  Ehp: number;
  Im_ehp: number;
  Lvl3_ehp: number;
  F2p_ehp: number;
  Ehb: number;
  Im_ehb: number;
  info: PlayerInfo;
}

interface PlayerHistory {
  name: string;
  last_date: string;
  first_date: string;
  seconds: number;
  ehp: number;
  xp: number;
}

export interface PlayerNames {
  aliases: {
    [key: string]: {
      name: string;
      last_used: string;
      last_used_seconds: number;
      ehp_gained: number;
      time_used: number;
    };
  };
  history: PlayerHistory[];
  info: {
    total_history_seconds: number;
  };
}
export interface PlayerRecords {
  [key: string]: {
    [key: string]: { xp: string | number; date: string };
  };
}

export enum CacheTypes {
  PLAYER_STATS = 'player stats',
  PLAYER_NAMES = 'player names',
  PLAYER_RECORDS = 'player records',
}

const addToCache = (
  username: string,
  data: PlayerStats | PlayerNames | PlayerRecords,
  type: CacheTypes
): void => {
  if (type === CacheTypes.PLAYER_STATS) {
    if (Object.keys(playerStats).length > maxCacheSize) playerStats = {};
    playerStats[username] = data as PlayerStats;
  } else if (type === CacheTypes.PLAYER_NAMES) {
    if (Object.keys(playerNames).length > maxCacheSize) playerNames = {};
    playerNames[username] = data as PlayerNames;
  } else if (type === CacheTypes.PLAYER_RECORDS) {
    if (Object.keys(playerRecords).length > maxCacheSize) playerRecords = {};
    playerRecords[username] = data as PlayerRecords;
  }
};

export const fetchTemple = async (
  msg: Message,
  playerName: string,
  type: CacheTypes
): Promise<boolean> => {
  let url: string;
  if (type === CacheTypes.PLAYER_STATS)
    url = `${TEMPLE_LINK}${playerName}&bosses=1`;
  else if (type === CacheTypes.PLAYER_NAMES)
    url = `${TEMPLE_PLAYER_NAMES}${playerName}`;
  else if (type === CacheTypes.PLAYER_RECORDS)
    url = `${TEMPLE_RECORDS}${playerName}&tracking=all`;
  else url = '';
  try {
    const res: AxiosResponse = await axios.get(`${url}`);
    if (res.data.error) {
      if (res.data.error.Code === 402) {
        const embed: Embed = new Embed();
        embed.addField(
          'ERROR',
          `Player **${playerName}** not found. Are you sure the account exists? Add a datapoint and try again.\`\`\`.datapoint username\`\`\``
        );
        msg.channel.send(embed);
      } else errorHandler(res.data.error, msg);
      return false;
    } else {
      let data;

      if (type === CacheTypes.PLAYER_STATS) data = res.data.data;
      else if (type === CacheTypes.PLAYER_NAMES) data = res.data.data;
      else if (type === CacheTypes.PLAYER_RECORDS) data = res.data.records;
      addToCache(playerName, data, type);
      return true;
    }
  } catch (err) {
    errorHandler(err, msg);
    return false;
  }
};
