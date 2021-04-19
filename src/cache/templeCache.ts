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
let playerStatsLength: number = 0;
export let playerNames: { [key: string]: TemplePlayerNames } = {};
let playerNamesLength: number = 0;
export let playerRecords: { [key: string]: TemplePlayerRecords } = {};
let playerRecordsLength: number = 0;
export let playerOverviewSkill: { [key: string]: TempleOverviewSkill } = {};
let playerOverviewSkillLength: number = 0;
export let playerOverviewOther: { [key: string]: TempleOverviewOther } = {};
let playerOverviewOtherLength: number = 0;
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
      } else msg.channel.send(errorHandler(res.data.error));
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

      // For some cases like records and gains, there are different objects depending on time field, so I want to store keys like "zezimaweek"
      if (time !== '') cacheItemName = playerName + time;
      else cacheItemName = playerName;
      addToCache(cacheItemName, data, type);
      return true;
    }
  } catch (err) {
    msg.channel.send(errorHandler(err));
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
  // Storing the length of cache as variable so I don't have to do Object.keys() every time
  if (type === TempleCacheType.PLAYER_STATS) {
    if (playerStatsLength >= maxCacheSize) {
      playerStats = {};
      playerStatsLength = 0;
    }

    playerStatsLength++;
    playerStats[username] = data as TemplePlayerStats;
  } else if (type === TempleCacheType.PLAYER_NAMES) {
    if (playerNamesLength >= maxCacheSize) {
      playerNames = {};
      Object.keys(playerNames).forEach((key) => {
        delete playerNames[key];
      });
      playerNamesLength = 0;
    }
    playerNamesLength++;
    playerNames[username] = data as TemplePlayerNames;
  } else if (type === TempleCacheType.PLAYER_RECORDS) {
    if (playerRecordsLength >= maxCacheSize) {
      Object.keys(playerRecords).forEach((key) => {
        delete playerRecords[key];
      });
      playerRecordsLength = 0;
    }
    playerRecordsLength++;
    playerRecords[username] = data as TemplePlayerRecords;
  } else if (type === TempleCacheType.PLAYER_OVERVIEW_SKILL) {
    if (playerOverviewSkillLength >= maxCacheSize) {
      Object.keys(playerOverviewSkill).forEach((key) => {
        delete playerOverviewSkill[key];
      });
      playerOverviewSkillLength = 0;
    }
    playerOverviewSkillLength++;
    playerOverviewSkill[username] = data as TempleOverviewSkill;
  } else if (type === TempleCacheType.PLAYER_OVERVIEW_OTHER) {
    if (playerOverviewOtherLength >= maxCacheSize) {
      Object.keys(playerOverviewOther).forEach((key) => {
        delete playerOverviewOther[key];
      });
      playerOverviewOtherLength = 0;
    }
    playerOverviewOtherLength++;
    playerOverviewOther[username] = data as TempleOverviewOther;
  }
};
