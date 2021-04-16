import axios, { AxiosResponse } from 'axios';
import { Embed } from '../utils/embed';
import { osrsDataParser } from '../utils/osrs/osrsDataParser';
import { errorHandler } from '../utils/errorHandler';
import dotenv from 'dotenv';
import { Message } from 'discord.js';

dotenv.config({ path: 'config.env' });
const HISCORE_API: string = process.env.OSRS_HISCORE_API as string;
const maxCacheSize = 1000;
export let osrsStats: { [key: string]: OsrsPlayer } = {};

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
      const embed: Embed = new Embed();
      embed.addField('ERROR', `Player **${keyword}** not found`);
      msg.channel.send(embed);
    } else errorHandler(err, msg);
    return false;
  }
};

const setOsrsStats = (username: string, data: OsrsPlayer): void => {
  if (Object.keys(osrsStats).length > maxCacheSize) osrsStats = {};
  const playerName: string = username;
  const playerData: OsrsPlayer = data;
  osrsStats[playerName] = playerData;
};
export interface OsrsSkill {
  rank: number | string;
  level: number | string;
  exp: number | string;
}

export interface BossOrMinigame {
  rank: number | string;
  score: number | string;
}

export interface OsrsPlayer {
  Overall: OsrsSkill;
  Attack: OsrsSkill;
  Defence: OsrsSkill;
  Strength: OsrsSkill;
  Hitpoints: OsrsSkill;
  Ranged: OsrsSkill;
  Prayer: OsrsSkill;
  Magic: OsrsSkill;
  Cooking: OsrsSkill;
  Woodcutting: OsrsSkill;
  Fletching: OsrsSkill;
  Fishing: OsrsSkill;
  Firemaking: OsrsSkill;
  Crafting: OsrsSkill;
  Smithing: OsrsSkill;
  Mining: OsrsSkill;
  Herblore: OsrsSkill;
  Agility: OsrsSkill;
  Thieving: OsrsSkill;
  Slayer: OsrsSkill;
  Farming: OsrsSkill;
  Runecrafting: OsrsSkill;
  Hunter: OsrsSkill;
  Construction: OsrsSkill;
  League_Points: BossOrMinigame;
  Bh_Hunter: BossOrMinigame;
  Bh_Rogue: BossOrMinigame;
  Clue_all: BossOrMinigame;
  Clue_beginner: BossOrMinigame;
  Clue_easy: BossOrMinigame;
  Clue_medium: BossOrMinigame;
  Clue_hard: BossOrMinigame;
  Clue_elite: BossOrMinigame;
  Clue_master: BossOrMinigame;
  Lms_Rank: BossOrMinigame;
  Soul_Wars_Zeal: BossOrMinigame;
  'Abyssal Sire': BossOrMinigame;
  'Alchemical Hydra': BossOrMinigame;
  'Barrows Chests': BossOrMinigame;
  Bryophyta: BossOrMinigame;
  Callisto: BossOrMinigame;
  Cerberus: BossOrMinigame;
  'Chambers of Xeric': BossOrMinigame;
  'Chambers of Xeric Challenge Mode': BossOrMinigame;
  'Chaos Elemental': BossOrMinigame;
  'Chaos Fanatic': BossOrMinigame;
  'Commander Zilyana': BossOrMinigame;
  'Corporeal Beast': BossOrMinigame;
  'Crazy Archaeologist': BossOrMinigame;
  'Dagannoth Prime': BossOrMinigame;
  'Dagannoth Rex': BossOrMinigame;
  'Dagannoth Supreme': BossOrMinigame;
  'Deranged Archaeologist': BossOrMinigame;
  'General Graardor': BossOrMinigame;
  'Giant Mole': BossOrMinigame;
  'Grotesque Guardians': BossOrMinigame;
  Hespori: BossOrMinigame;
  'Kalphite Queen': BossOrMinigame;
  'King Black Dragon': BossOrMinigame;
  Kraken: BossOrMinigame;
  KreeArra: BossOrMinigame;
  'Kril Tsutsaroth': BossOrMinigame;
  Mimic: BossOrMinigame;
  'The Nightmare': BossOrMinigame;
  Obor: BossOrMinigame;
  Sarachnis: BossOrMinigame;
  Scorpia: BossOrMinigame;
  Skotizo: BossOrMinigame;
  Tempoross: BossOrMinigame;
  'The Gauntlet': BossOrMinigame;
  'The Corrupted Gauntlet': BossOrMinigame;
  'Theatre of Blood': BossOrMinigame;
  'Thermonuclear Smoke Devil': BossOrMinigame;
  'TzKal-Zuk': BossOrMinigame;
  'TzTok-Jad': BossOrMinigame;
  Venenatis: BossOrMinigame;
  Vetion: BossOrMinigame;
  Vorkath: BossOrMinigame;
  Wintertodt: BossOrMinigame;
  Zalcano: BossOrMinigame;
  Zulrah: BossOrMinigame;
}
