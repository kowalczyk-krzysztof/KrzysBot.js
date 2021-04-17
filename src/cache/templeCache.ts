import dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';
import { Message } from 'discord.js';
import { Embed } from '../utils/embed';
import { errorHandler } from '../utils/errorHandler';

export let playerStats: { [key: string]: PlayerStats } = {};
export let playerNames: { [key: string]: PlayerNames } = {};
export let playerRecords: { [key: string]: PlayerRecords } = {};
export let playerOverviewSkill: { [key: string]: PlayerOverviewSkill } = {};
export let playerOverviewOther: { [key: string]: PlayerOverviewOther } = {};

dotenv.config({ path: 'config.env' });

const TEMPLE_LINK: string = process.env.TEMPLE_PLAYER_STATS as string;
const TEMPLE_PLAYER_NAMES: string = process.env.TEMPLE_PLAYER_NAMES as string;
const TEMPLE_RECORDS: string = process.env.TEMPLE_RECORDS as string;
const TEMPLE_OVERVIEW: string = process.env.TEMPLE_OVERVIEW as string;
const maxCacheSize: number = 1000;

export enum GameMode {
  MAIN = 0,
  IM = 1,
  UIM = 2,
  HCIM = 3,
}

export interface PlayerOverviewSkill {
  info: {
    last_check_text: string;
    hours_played: number;
    hours_per_day: number;
    xp_gained: number;
    xp_per_day: number;
    avr_xph: number;
    top_skill: number;
    gp_spent: number;
  };
  table: {
    [key: string]: {
      xp: number;
      rank: number;
      level: number;
      ehp: number;
    };
  };
}

export interface PlayerOverviewOther {
  info: {
    last_check_text: string;
    hours_played: number;
    hours_per_day: number;
    boss_kills: number;
    kc_per_day: number;
    avr_kch: number;
    top_boss: number;
    gp_earned: number;
  };
  table: {
    [key: string]: {
      xp: number;
      rank: number;
      ehb: number;
    };
  };
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
  PLAYER_STATS = 'stats',
  PLAYER_NAMES = 'names',
  PLAYER_RECORDS = 'records',
  PLAYER_OVERVIEW_SKILL = 'skillgains',
  PLAYER_OVERVIEW_OTHER = 'othergains',
}

export enum CacheTypesAliases {
  PLAYER_OVERVIEW_SKILL = 'skill gains',
  PLAYER_OVERVIEW_OTHER = 'other gains',
}

const addToCache = (
  username: string,
  data:
    | PlayerStats
    | PlayerNames
    | PlayerRecords
    | PlayerOverviewSkill
    | PlayerOverviewOther,
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
  } else if (type === CacheTypes.PLAYER_OVERVIEW_SKILL) {
    if (Object.keys(playerOverviewSkill).length > maxCacheSize)
      playerOverviewSkill = {};
    playerOverviewSkill[username] = data as PlayerOverviewSkill;
  } else if (type === CacheTypes.PLAYER_OVERVIEW_OTHER) {
    if (Object.keys(playerOverviewOther).length > maxCacheSize)
      playerOverviewOther = {};
    playerOverviewOther[username] = data as PlayerOverviewOther;
  }
};

export const fetchTemple = async (
  msg: Message,
  playerName: string,
  type: CacheTypes,
  time: string = ''
): Promise<boolean> => {
  let url: string;
  if (type === CacheTypes.PLAYER_STATS)
    url = `${TEMPLE_LINK}${playerName}&bosses=1`;
  else if (type === CacheTypes.PLAYER_NAMES)
    url = `${TEMPLE_PLAYER_NAMES}${playerName}`;
  else if (type === CacheTypes.PLAYER_RECORDS)
    url = `${TEMPLE_RECORDS}${playerName}&tracking=all`;
  else if (type === CacheTypes.PLAYER_OVERVIEW_SKILL)
    url = `${TEMPLE_OVERVIEW}${playerName}&duration=${time}`;
  else if (type === CacheTypes.PLAYER_OVERVIEW_OTHER)
    url = `${TEMPLE_OVERVIEW}${playerName}&duration=${time}&tracking=bosses`;
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
      if (
        type === CacheTypes.PLAYER_STATS ||
        type === CacheTypes.PLAYER_NAMES ||
        type === CacheTypes.PLAYER_OVERVIEW_SKILL ||
        type === CacheTypes.PLAYER_OVERVIEW_OTHER
      )
        data = res.data.data;
      else if (type === CacheTypes.PLAYER_RECORDS) data = res.data.records;
      let cacheItemName: string;
      if (time !== '') cacheItemName = playerName + time;
      else cacheItemName = playerName;
      addToCache(cacheItemName, data, type);
      return true;
    }
  } catch (err) {
    errorHandler(err, msg);
    return false;
  }
};
