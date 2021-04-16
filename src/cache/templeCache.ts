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
    [key: string]: { xp: number; date: string };
  };
}

const setPlayerStats = (username: string, data: PlayerStats): void => {
  if (Object.keys(playerStats).length > maxCacheSize) playerStats = {};
  const playerName: string = username;
  const playerData: PlayerStats = data;
  playerStats[playerName] = playerData;
};

const setPlayerNames = (username: string, data: PlayerNames): void => {
  if (Object.keys(playerNames).length > maxCacheSize) playerNames = {};
  const playerName: string = username;
  const playerData: PlayerNames = data;
  playerNames[playerName] = playerData;
};

const setPlayerRecords = (username: string, data: PlayerRecords): void => {
  if (Object.keys(playerRecords).length > maxCacheSize) playerRecords = {};
  const playerName: string = username;
  const playerData: PlayerRecords = data;
  playerRecords[playerName] = playerData;
};

export const fetchTemple = async (
  msg: Message,
  playerName: string
): Promise<boolean> => {
  const keyword: string = playerName;
  try {
    const res: AxiosResponse = await axios.get(
      `${TEMPLE_LINK}${keyword}&bosses=1`
    );
    if (res.data.error) {
      if (res.data.error.Code === 402) {
        const embed: Embed = new Embed();
        embed.addField(
          'ERROR',
          `Player **${keyword}** not found. Are you sure the account exists? Add a datapoint and try again.\`\`\`.datapoint username\`\`\``
        );
        msg.channel.send(embed);
      } else errorHandler(res.data.error, msg);
      return false;
    } else {
      setPlayerStats(keyword, res.data.data);
      return true;
    }
  } catch (err) {
    errorHandler(err, msg);
    return false;
  }
};

export const fetchPlayerNames = async (
  msg: Message,
  playerName: string
): Promise<boolean> => {
  const keyword: string = playerName;
  try {
    const res: AxiosResponse = await axios.get(
      `${TEMPLE_PLAYER_NAMES}${keyword}`
    );

    if (res.data.error) {
      if (res.data.error.Code === 402) {
        const embed: Embed = new Embed();
        embed.addField(
          'ERROR',
          `Player **${keyword}** not found. Are you sure the account exists? Add a datapoint and try again.\`\`\`.datapoint username\`\`\``
        );
        msg.channel.send(embed);
      } else errorHandler(res.data.error, msg);
      return false;
    } else {
      setPlayerNames(keyword, res.data.data);
      return true;
    }
  } catch (err) {
    errorHandler(err, msg);
    return false;
  }
};

export const fetchPlayerRecords = async (
  msg: Message,
  playerName: string
): Promise<boolean> => {
  const keyword: string = playerName;
  try {
    const res: AxiosResponse = await axios.get(
      `${TEMPLE_RECORDS}${keyword}&tracking=all`
    );

    if (res.data.error) {
      if (res.data.error.Code === 402) {
        const embed: Embed = new Embed();
        embed.addField(
          'ERROR',
          `Player **${keyword}** not found. Are you sure the account exists? Add a datapoint and try again.\`\`\`.datapoint username\`\`\``
        );
        msg.channel.send(embed);
      } else errorHandler(res.data.error, msg);
      return false;
    } else {
      setPlayerRecords(keyword, res.data.records);
      return true;
    }
  } catch (err) {
    errorHandler(err, msg);
    return false;
  }
};
