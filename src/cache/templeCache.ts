import dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';
import { Message } from 'discord.js';
import { Embed } from '../utils/embed';
import { errorHandler } from '../utils/errorHandler';
import { TempleOther } from '../utils/osrs/enums';

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
  [TempleOther.INFO]: {
    [TempleOther.LAST_CHECK_TEXT]: string;
    [TempleOther.HOURS_PLAYED]: number;
    [TempleOther.HOURS_PER_DAY]: number;
    [TempleOther.XP_GAINED]: number;
    [TempleOther.XP_PER_DAY]: number;
    [TempleOther.AVR_XPH]: number;
    [TempleOther.TOP_SKILL]: number;
    [TempleOther.GP_SPENT]: number;
  };
  [TempleOther.TABLE]: {
    [key: string]: {
      [TempleOther.XP]: number;
      [TempleOther.RANK]: number;
      [TempleOther.LEVEL]: number;
      [TempleOther.EHP_LOWERCASE]: number;
    };
  };
}

export interface PlayerOverviewOther {
  [TempleOther.INFO]: {
    [TempleOther.LAST_CHECK_TEXT]: string;
    [TempleOther.HOURS_PLAYED]: number;
    [TempleOther.HOURS_PER_DAY]: number;
    [TempleOther.BOSS_KILLS]: number;
    [TempleOther.KC_PER_DAY]: number;
    [TempleOther.AVR_KCH]: number;
    [TempleOther.TOP_BOSS]: number;
    [TempleOther.GP_EARNED]: number;
  };
  [TempleOther.TABLE]: {
    [key: string]: {
      [TempleOther.XP]: number;
      [TempleOther.RANK]: number;
      [TempleOther.EHB_LOWERCASE]: number;
    };
  };
}

interface PlayerInfo {
  [TempleOther.USERNAME]: string;
  [TempleOther.COUNTRY]: string;
  [TempleOther.GAME_MODE]: GameMode;
  [TempleOther.CB3]: number;
  [TempleOther.F2P]: number;
  [TempleOther.BANNED]: number;
  [TempleOther.DISQUALIFIED]: number;
  [TempleOther.CLAN_PREF]: null | string;
  [TempleOther.LAST_CHECKED]: string;
  [TempleOther.LAST_CHANGED]: string;
}

export interface PlayerStats {
  [TempleOther.DATE]: string;
  [TempleOther.EHP]: number;
  [TempleOther.IM_EHP_CAPITAL]: number;
  [TempleOther.LVL3_EHP]: number;
  [TempleOther.F2P_EHP]: number;
  [TempleOther.EHB]: number;
  [TempleOther.IM_EHB]: number;
  [TempleOther.INFO]: PlayerInfo;
}

interface PlayerHistory {
  [TempleOther.NAME]: string;
  [TempleOther.LATS_DATE]: string;
  [TempleOther.FIRST_DATE]: string;
  [TempleOther.SECONDS]: number;
  [TempleOther.EHP_LOWERCASE]: number;
  [TempleOther.XP]: number;
}

export interface PlayerNames {
  [TempleOther.ALIASES]: {
    [key: string]: {
      [TempleOther.NAME]: string;
      [TempleOther.LAST_USED]: string;
      [TempleOther.LAST_USED_SECONDS]: number;
      [TempleOther.EHP_GAINED]: number;
      [TempleOther.TIME_USED]: number;
    };
  };
  [TempleOther.HISTORY]: PlayerHistory[];
  [TempleOther.INFO]: {
    [TempleOther.HISTORY_SECONDS]: number;
  };
}
export interface PlayerRecords {
  [key: string]: {
    [key: string]: {
      [TempleOther.XP]: string | number;
      [TempleOther.DATE_LOWERCASE]: string;
    };
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
