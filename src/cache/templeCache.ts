// Discord
import { Message } from 'discord.js';
// Dotenv
import dotenv from 'dotenv';
// Axios
import axios, { AxiosResponse } from 'axios';
// UTILS: Embeds
import { Embed } from '../utils/embed';
// UTILS: Interfaces
import {
  TemplePlayerStats,
  TemplePlayerNames,
  TemplePlayerRecords,
  TempleOverviewSkill,
  TempleOverviewOther,
} from '../utils/osrs/interfaces';
// UTILS: Enums
import { TempleCacheType } from '../utils/osrs/enums';
// UTILS: Error handler
import { errorHandler } from '../utils/errorHandler';

dotenv.config({ path: 'config.env' });

// Caches
export let playerStats: { [key: string]: TemplePlayerStats } = {};
export let playerNames: { [key: string]: TemplePlayerNames } = {};
export let playerRecords: { [key: string]: TemplePlayerRecords } = {};
export let playerOverviewSkill: { [key: string]: TempleOverviewSkill } = {};
export let playerOverviewOther: { [key: string]: TempleOverviewOther } = {};
// URLs
const TEMPLE_LINK: string = process.env.TEMPLE_PLAYER_STATS as string;
const TEMPLE_PLAYER_NAMES: string = process.env.TEMPLE_PLAYER_NAMES as string;
const TEMPLE_RECORDS: string = process.env.TEMPLE_RECORDS as string;
const TEMPLE_OVERVIEW: string = process.env.TEMPLE_OVERVIEW as string;
// Max cache size
const maxCacheSize: number = 1000;

// Fetch data
export const fetchTemple = async (
  msg: Message,
  playerName: string,
  type: TempleCacheType,
  time: string = ''
): Promise<boolean> => {
  let url: string;
  if (type === TempleCacheType.PLAYER_STATS)
    url = `${TEMPLE_LINK}${playerName}&bosses=1`;
  else if (type === TempleCacheType.PLAYER_NAMES)
    url = `${TEMPLE_PLAYER_NAMES}${playerName}`;
  else if (type === TempleCacheType.PLAYER_RECORDS)
    url = `${TEMPLE_RECORDS}${playerName}&tracking=all`;
  else if (type === TempleCacheType.PLAYER_OVERVIEW_SKILL)
    url = `${TEMPLE_OVERVIEW}${playerName}&duration=${time}`;
  else if (type === TempleCacheType.PLAYER_OVERVIEW_OTHER)
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
      } else errorHandler(msg, res.data.error);
      return false;
    } else {
      let data;
      if (
        type === TempleCacheType.PLAYER_STATS ||
        type === TempleCacheType.PLAYER_NAMES ||
        type === TempleCacheType.PLAYER_OVERVIEW_SKILL ||
        type === TempleCacheType.PLAYER_OVERVIEW_OTHER
      )
        data = res.data.data;
      else if (type === TempleCacheType.PLAYER_RECORDS) data = res.data.records;
      let cacheItemName: string;
      if (time !== '') cacheItemName = playerName + time;
      else cacheItemName = playerName;
      addToCache(cacheItemName, data, type);
      return true;
    }
  } catch (err) {
    errorHandler(msg, err);
    return false;
  }
};
// Cache result
const addToCache = (
  username: string,
  data:
    | TemplePlayerStats
    | TemplePlayerNames
    | TemplePlayerRecords
    | TempleOverviewSkill
    | TempleOverviewOther,
  type: TempleCacheType
): void => {
  if (type === TempleCacheType.PLAYER_STATS) {
    if (Object.keys(playerStats).length > maxCacheSize) playerStats = {};
    playerStats[username] = data as TemplePlayerStats;
  } else if (type === TempleCacheType.PLAYER_NAMES) {
    if (Object.keys(playerNames).length > maxCacheSize) playerNames = {};
    playerNames[username] = data as TemplePlayerNames;
  } else if (type === TempleCacheType.PLAYER_RECORDS) {
    if (Object.keys(playerRecords).length > maxCacheSize) playerRecords = {};
    playerRecords[username] = data as TemplePlayerRecords;
  } else if (type === TempleCacheType.PLAYER_OVERVIEW_SKILL) {
    if (Object.keys(playerOverviewSkill).length > maxCacheSize)
      playerOverviewSkill = {};
    playerOverviewSkill[username] = data as TempleOverviewSkill;
  } else if (type === TempleCacheType.PLAYER_OVERVIEW_OTHER) {
    if (Object.keys(playerOverviewOther).length > maxCacheSize)
      playerOverviewOther = {};
    playerOverviewOther[username] = data as TempleOverviewOther;
  }
};
