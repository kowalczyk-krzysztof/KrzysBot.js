import axios, { AxiosResponse } from 'axios';
import { Embed } from '../utils/embed';
import { osrsDataParser } from '../utils/osrs/osrsDataParser';
import { errorHandler } from '../utils/errorHandler';
import dotenv from 'dotenv';
import { Message } from 'discord.js';
import {
  Bosses,
  Clues,
  OsrsOther,
  Skills,
  TempleOther,
} from '../utils/osrs/enums';

dotenv.config({ path: 'config.env' });
const HISCORE_API: string = process.env.OSRS_HISCORE_API as string;
const maxCacheSize: number = 1000;
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
      msg.channel.send(
        new Embed().addField('ERROR', `Player **${keyword}** not found`)
      );
    } else errorHandler(err, msg);
    return false;
  }
};

const setOsrsStats = (username: string, data: OsrsPlayer): void => {
  if (Object.keys(osrsStats).length > maxCacheSize) osrsStats = {};
  osrsStats[username] = data;
};
export interface OsrsSkill {
  [TempleOther.RANK]: number | string;
  [TempleOther.LEVEL]: number | string;
  [TempleOther.EXP]: number | string;
}

export interface BossOrMinigame {
  [TempleOther.RANK]: number | string;
  [TempleOther.SCORE]: number | string;
}

export interface OsrsPlayer {
  [Skills.TOTAL]: OsrsSkill;
  [Skills.ATT]: OsrsSkill;
  [Skills.DEF]: OsrsSkill;
  [Skills.STR]: OsrsSkill;
  [Skills.HP]: OsrsSkill;
  [Skills.RANGED]: OsrsSkill;
  [Skills.PRAY]: OsrsSkill;
  [Skills.MAGIC]: OsrsSkill;
  [Skills.COOK]: OsrsSkill;
  [Skills.WC]: OsrsSkill;
  [Skills.FLETCH]: OsrsSkill;
  [Skills.FISH]: OsrsSkill;
  [Skills.FM]: OsrsSkill;
  [Skills.CRAFT]: OsrsSkill;
  [Skills.SMITH]: OsrsSkill;
  [Skills.MINING]: OsrsSkill;
  [Skills.HERB]: OsrsSkill;
  [Skills.AGIL]: OsrsSkill;
  [Skills.THIEV]: OsrsSkill;
  [Skills.SLAYER]: OsrsSkill;
  [Skills.FARM]: OsrsSkill;
  [Skills.RC]: OsrsSkill;
  [Skills.HUNT]: OsrsSkill;
  [Skills.CON]: OsrsSkill;
  [OsrsOther.LEAGUE]: BossOrMinigame;
  [OsrsOther.BH_HUNTER]: BossOrMinigame;
  [OsrsOther.BH_ROGUE]: BossOrMinigame;
  [Clues.ALL]: BossOrMinigame;
  [Clues.BEGINNER]: BossOrMinigame;
  [Clues.EASY]: BossOrMinigame;
  [Clues.MEDIUM]: BossOrMinigame;
  [Clues.HARD]: BossOrMinigame;
  [Clues.ELITE]: BossOrMinigame;
  [Clues.MASTER]: BossOrMinigame;
  [OsrsOther.LMS]: BossOrMinigame;
  [OsrsOther.SOULWARS]: BossOrMinigame;
  [Bosses.SIRE]: BossOrMinigame;
  [Bosses.HYDRA]: BossOrMinigame;
  [Bosses.BARROWS]: BossOrMinigame;
  [Bosses.BRYOPHYTA]: BossOrMinigame;
  [Bosses.CALLISTO]: BossOrMinigame;
  [Bosses.CERBERUS]: BossOrMinigame;
  [Bosses.COX]: BossOrMinigame;
  [Bosses.COXCM]: BossOrMinigame;
  [Bosses.CHAOS_ELE]: BossOrMinigame;
  [Bosses.CHAOS_FANATIC]: BossOrMinigame;
  [Bosses.ZILYANA]: BossOrMinigame;
  [Bosses.CORP]: BossOrMinigame;
  [Bosses.CRAZY_ARCH]: BossOrMinigame;
  [Bosses.PRIME]: BossOrMinigame;
  [Bosses.REX]: BossOrMinigame;
  [Bosses.SUPREME]: BossOrMinigame;
  [Bosses.DER_ARCH]: BossOrMinigame;
  [Bosses.GRAARDOR]: BossOrMinigame;
  [Bosses.MOLE]: BossOrMinigame;
  [Bosses.GUARDIANS]: BossOrMinigame;
  [Bosses.HESPORI]: BossOrMinigame;
  [Bosses.KQ]: BossOrMinigame;
  [Bosses.KBD]: BossOrMinigame;
  [Bosses.KRAKEN]: BossOrMinigame;
  [Bosses.KREE]: BossOrMinigame;
  [Bosses.KRIL]: BossOrMinigame;
  [Bosses.MIMIC]: BossOrMinigame;
  [Bosses.NIGHTMARE]: BossOrMinigame;
  [Bosses.OBOR]: BossOrMinigame;
  [Bosses.SARACHNIS]: BossOrMinigame;
  [Bosses.SCORPIA]: BossOrMinigame;
  [Bosses.SKOTIZO]: BossOrMinigame;
  [Bosses.TEMPO]: BossOrMinigame;
  [Bosses.GAUNTLET]: BossOrMinigame;
  [Bosses.CORR_GAUNTLET]: BossOrMinigame;
  [Bosses.TOB]: BossOrMinigame;
  [Bosses.THERMY]: BossOrMinigame;
  [Bosses.ZUK]: BossOrMinigame;
  [Bosses.JAD]: BossOrMinigame;
  [Bosses.VENE]: BossOrMinigame;
  [Bosses.VETION]: BossOrMinigame;
  [Bosses.VORKATH]: BossOrMinigame;
  [Bosses.WT]: BossOrMinigame;
  [Bosses.ZALCANO]: BossOrMinigame;
  [Bosses.ZULRAH]: BossOrMinigame;
}
