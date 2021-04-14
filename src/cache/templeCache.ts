import dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';
import { Message } from 'discord.js';
import { Embed } from '../utils/embed';
import { errorHandler } from '../utils/errorHandler';

export let playerStats: { [key: string]: PlayerStats } = {};
export let playerNames: { [key: string]: PlayerNames } = {};

dotenv.config({ path: 'config.env' });

const TEMPLE_LINK = process.env.TEMPLE_PLAYER_STATS;
const TEMPLE_PLAYER_NAMES = process.env.TEMPLE_PLAYER_NAMES;
const maxCacheSize = 1000;

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

interface PlayerStats {
  Date: string;
  Overall: number;
  Attack: number;
  Defence: number;
  Strength: number;
  Hitpoints: number;
  Ranged: number;
  Prayer: number;
  Magic: number;
  Cooking: number;
  Woodcutting: number;
  Fletching: number;
  Fishing: number;
  Firemaking: number;
  Crafting: number;
  Smithing: number;
  Mining: number;
  Herblore: number;
  Agility: number;
  Thieving: number;
  Slayer: number;
  Farming: number;
  Runecraft: number;
  Hunter: number;
  Construction: number;
  Ehp: number;
  Im_ehp: number;
  Lvl3_ehp: number;
  F2p_ehp: number;
  Clue_all: number;
  Clue_beginner: number;
  Clue_easy: number;
  Clue_medium: number;
  Clue_hard: number;
  Clue_elite: number;
  Clue_master: number;
  LMS: number;
  'Abyssal Sire': number;
  'Alchemical Hydra': number;
  'Barrows Chests': number;
  Bryophyta: number;
  Callisto: number;
  Cerberus: number;
  'Chambers of Xeric': number;
  'Chambers of Xeric Challenge Mode': number;
  'Chaos Elemental': number;
  'Chaos Fanatic': number;
  'Commander Zilyana': number;
  'Corporeal Beast': number;
  'Crazy Archaeologist': number;
  'Dagannoth Prime': number;
  'Dagannoth Rex': number;
  'Dagannoth Supreme': number;
  'Deranged Archaeologist': number;
  'General Graardor': number;
  'Giant Mole': number;
  'Grotesque Guardians': number;
  Hespori: number;
  'Kalphite Queen': number;
  'King Black Dragon': number;
  Kraken: number;
  KreeArra: number;
  'Kril Tsutsaroth': number;
  Mimic: number;
  'The Nightmare': number;
  Obor: number;
  Sarachnis: number;
  Scorpia: number;
  Skotizo: number;
  'The Gauntlet': number;
  'The Corrupted Gauntlet': number;
  'Theatre of Blood': number;
  'Thermonuclear Smoke Devil': number;
  'TzKal-Zuk': number;
  'TzTok-Jad': number;
  Venenatis: number;
  Vetion: number;
  Vorkath: number;
  Wintertodt: number;
  Zalcano: number;
  Zulrah: number;
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

interface PlayerNames {
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

const setPlayerStats = (username: string, data: PlayerStats) => {
  if (Object.keys(playerStats).length > maxCacheSize) playerStats = {};
  const playerName: string = username;
  const playerData: PlayerStats = data;
  playerStats[playerName] = playerData;
};

const setPlayerNames = (username: string, data: PlayerNames) => {
  if (Object.keys(playerNames).length > maxCacheSize) playerNames = {};
  const playerName: string = username;
  const playerData: PlayerNames = data;
  playerNames[playerName] = playerData;
};

export const fetchTemple = async (msg: Message, playerName: string) => {
  const keyword = playerName;
  try {
    const res: AxiosResponse = await axios.get(
      `${TEMPLE_LINK}${keyword}&bosses=1`
    );

    if (res.data.error) {
      if (res.data.error.Code === 402) {
        const embed = new Embed();
        embed.addField(
          'ERROR',
          `Player **${keyword}** not found. Are you sure the account exists? Add a datapoint and try again.\`\`\`.datapoint <username>\`\`\``
        );
        msg.channel.send(embed);
      } else errorHandler(null, msg);
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

export const fetchPlayerNames = async (msg: Message, playerName: string) => {
  const keyword = playerName;
  try {
    const res: AxiosResponse = await axios.get(
      `${TEMPLE_PLAYER_NAMES}${keyword}`
    );

    if (res.data.error) {
      if (res.data.error.Code === 402) {
        const embed = new Embed();
        embed.addField(
          'ERROR',
          `Player **${keyword}** not found. Are you sure the account exists? Add a datapoint and try again.\`\`\`.datapoint <username>\`\`\``
        );
        msg.channel.send(embed);
      } else errorHandler(null, msg);
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
