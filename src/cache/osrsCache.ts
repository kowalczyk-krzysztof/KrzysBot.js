import axios, { AxiosResponse } from 'axios';
import { Embed } from '../utils/embed';
import { osrsDataParser } from '../utils/osrs/osrsDataParser';
import { errorHandler } from '../utils/errorHandler';
import dotenv from 'dotenv';
import { Message } from 'discord.js';

dotenv.config({ path: 'config.env' });
const HISCORE_API: string = process.env.OSRS_HISCORE_API as string;

export let osrsStats: { [key: string]: OsrsPlayer } = {};
const maxCacheSize = 1000;

export const fetchOsrsStats = async (msg: Message, playerName: string) => {
  const keyword = playerName;
  try {
    const res: AxiosResponse = await axios.get(`${HISCORE_API}${keyword}`);

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
      const data: OsrsPlayer = osrsDataParser(res.data);

      setOsrsStats(keyword, data);
      return true;
    }
  } catch (err) {
    errorHandler(err, msg);
    return false;
  }
};

const setOsrsStats = (username: string, data: OsrsPlayer) => {
  if (Object.keys(osrsStats).length > maxCacheSize) osrsStats = {};
  const playerName: string = username;
  const playerData: OsrsPlayer = data;
  osrsStats[playerName] = playerData;
};

export interface OsrsPlayer {
  Overall: {
    rank: number;
    level: number;
    exp: number;
  };
  Attack: {
    rank: number;
    level: number;
    exp: number;
  };
  Defence: {
    rank: number;
    level: number;
    exp: number;
  };
  Strength: {
    rank: number;
    level: number;
    exp: number;
  };
  Hitpoints: {
    rank: number;
    level: number;
    exp: number;
  };
  Ranged: {
    rank: number;
    level: number;
    exp: number;
  };
  Prayer: {
    rank: number;
    level: number;
    exp: number;
  };
  Magic: {
    rank: number;
    level: number;
    exp: number;
  };
  Cooking: {
    rank: number;
    level: number;
    exp: number;
  };
  Woodcutting: {
    rank: number;
    level: number;
    exp: number;
  };
  Fletching: {
    rank: number;
    level: number;
    exp: number;
  };
  Fishing: {
    rank: number;
    level: number;
    exp: number;
  };
  Firemaking: {
    rank: number;
    level: number;
    exp: number;
  };
  Crafting: {
    rank: number;
    level: number;
    exp: number;
  };
  Smithing: {
    rank: number;
    level: number;
    exp: number;
  };
  Mining: {
    rank: number;
    level: number;
    exp: number;
  };
  Herblore: {
    rank: number;
    level: number;
    exp: number;
  };
  Agility: {
    rank: number;
    level: number;
    exp: number;
  };
  Thieving: {
    rank: number;
    level: number;
    exp: number;
  };
  Slayer: {
    rank: number;
    level: number;
    exp: number;
  };
  Farming: {
    rank: number;
    level: number;
    exp: number;
  };
  Runecrafting: {
    rank: number;
    level: number;
    exp: number;
  };
  Hunter: {
    rank: number;
    level: number;
    exp: number;
  };
  Construction: {
    rank: number;
    level: number;
    exp: number;
  };
  League_Points: {
    rank: number;
    score: number;
  };
  Bh_Hunter: { rank: number; score: number };
  Bh_Rogue: { rank: number; score: number };
  Clue_all: { rank: number; score: number };
  Clue_beginner: { rank: number; score: number };
  Clue_easy: { rank: number; score: number };
  Clue_medium: { rank: number; score: number };
  Clue_hard: { rank: number; score: number };
  Clue_elite: { rank: number; score: number };
  Clue_master: { rank: number; score: number };
  Lms_Rank: { rank: number; score: number };
  Soul_Wars_Zeal: { rank: number; score: number };
  'Abyssal Sire': { rank: number; score: number };
  'Alchemical Hydra': { rank: number; score: number };
  'Barrows Chests': { rank: number; score: number };
  Bryophyta: { rank: number; score: number };
  Callisto: { rank: number; score: number };
  Cerberus: { rank: number; score: number };
  'Chambers of Xeric': { rank: number; score: number };
  'Chambers of Xeric Challenge Mode': { rank: number; score: number };
  'Chaos Elemental': { rank: number; score: number };
  'Chaos Fanatic': { rank: number; score: number };
  'Commander Zilyana': { rank: number; score: number };
  'Corporeal Beast': { rank: number; score: number };
  'Crazy Archaeologist': { rank: number; score: number };
  'Dagannoth Prime': { rank: number; score: number };
  'Dagannoth Rex': { rank: number; score: number };
  'Dagannoth Supreme': { rank: number; score: number };
  'Deranged Archaeologist': { rank: number; score: number };
  'General Graardor': { rank: number; score: number };
  'Giant Mole': { rank: number; score: number };
  'Grotesque Guardians': { rank: number; score: number };
  Hespori: { rank: number; score: number };
  'Kalphite Queen': { rank: number; score: number };
  'King Black Dragon': { rank: number; score: number };
  Kraken: { rank: number; score: number };
  KreeArra: { rank: number; score: number };
  'Kril Tsutsaroth': { rank: number; score: number };
  Mimic: { rank: number; score: number };
  'The Nightmare': { rank: number; score: number };
  Obor: { rank: number; score: number };
  Sarachnis: { rank: number; score: number };
  Scorpia: { rank: number; score: number };
  Skotizo: { rank: number; score: number };
  Tempoross: { rank: number; score: number };
  'The Gauntlet': { rank: number; score: number };
  'The Corrupted Gauntlet': { rank: number; score: number };
  'Theatre of Blood': { rank: number; score: number };
  'Thermonuclear Smoke Devil': { rank: number; score: number };
  'TzKal-Zuk': { rank: number; score: number };
  'TzTok-Jad': { rank: number; score: number };
  Venenatis: { rank: number; score: number };
  Vetion: { rank: number; score: number };
  Vorkath: { rank: number; score: number };
  Wintertodt: { rank: number; score: number };
  Zalcano: { rank: number; score: number };
  Zulrah: { rank: number; score: number };
}
