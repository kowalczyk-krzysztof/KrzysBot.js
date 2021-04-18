// UTILS: Interfaces
import { OsrsPlayer } from './interfaces';
// UTILS: Enums
import { Bosses, Clues, OsrsOther, Skills, TempleOther } from './enums';
// Read: https://runescape.wiki/w/Application_programming_interface#Hiscores_Lite_2
export const osrsDataParser = (data: string): OsrsPlayer => {
  const stringToArray: string[] = data.split('\n');
  const rankLevelExpString: string[][] = stringToArray.map((el: string) => {
    return el.split(',');
  });
  const rankLevelExp: (number | string)[][] = rankLevelExpString.map(
    (el: string[]) => {
      return el.map((el: string) => {
        if (el === '-1') return 'Unranked';
        else return parseInt(el);
      });
    }
  );

  const playerObject: OsrsPlayer = {
    [Skills.TOTAL]: {
      rank: rankLevelExp[0][0],
      level: rankLevelExp[0][1],
      exp: rankLevelExp[0][2],
    },
    [Skills.ATT]: {
      rank: rankLevelExp[1][0],
      level: rankLevelExp[1][1],
      exp: rankLevelExp[1][2],
    },
    [Skills.DEF]: {
      rank: rankLevelExp[2][0],
      level: rankLevelExp[2][1],
      exp: rankLevelExp[2][2],
    },
    [Skills.STR]: {
      rank: rankLevelExp[3][0],
      level: rankLevelExp[3][1],
      exp: rankLevelExp[3][2],
    },
    [Skills.HP]: {
      rank: rankLevelExp[4][0],
      level: rankLevelExp[4][1],
      exp: rankLevelExp[4][2],
    },
    [Skills.RANGED]: {
      rank: rankLevelExp[5][0],
      level: rankLevelExp[5][1],
      exp: rankLevelExp[5][2],
    },
    [Skills.PRAY]: {
      rank: rankLevelExp[6][0],
      level: rankLevelExp[6][1],
      exp: rankLevelExp[6][2],
    },
    [Skills.MAGIC]: {
      rank: rankLevelExp[7][0],
      level: rankLevelExp[7][1],
      exp: rankLevelExp[7][2],
    },
    [Skills.COOK]: {
      rank: rankLevelExp[8][0],
      level: rankLevelExp[8][1],
      exp: rankLevelExp[8][2],
    },
    [Skills.WC]: {
      rank: rankLevelExp[9][0],
      level: rankLevelExp[9][1],
      exp: rankLevelExp[9][2],
    },
    [Skills.FLETCH]: {
      rank: rankLevelExp[10][0],
      level: rankLevelExp[10][1],
      exp: rankLevelExp[10][2],
    },
    [Skills.FISH]: {
      rank: rankLevelExp[11][0],
      level: rankLevelExp[11][1],
      exp: rankLevelExp[11][2],
    },
    [Skills.FM]: {
      rank: rankLevelExp[12][0],
      level: rankLevelExp[12][1],
      exp: rankLevelExp[12][2],
    },
    [Skills.CRAFT]: {
      rank: rankLevelExp[13][0],
      level: rankLevelExp[13][1],
      exp: rankLevelExp[13][2],
    },
    [Skills.SMITH]: {
      rank: rankLevelExp[14][0],
      level: rankLevelExp[14][1],
      exp: rankLevelExp[14][2],
    },
    [Skills.MINING]: {
      rank: rankLevelExp[15][0],
      level: rankLevelExp[15][1],
      exp: rankLevelExp[15][2],
    },
    [Skills.HERB]: {
      rank: rankLevelExp[16][0],
      level: rankLevelExp[16][1],
      exp: rankLevelExp[16][2],
    },
    [Skills.AGIL]: {
      rank: rankLevelExp[17][0],
      level: rankLevelExp[17][1],
      exp: rankLevelExp[17][2],
    },
    [Skills.THIEV]: {
      rank: rankLevelExp[18][0],
      level: rankLevelExp[18][1],
      exp: rankLevelExp[18][2],
    },
    [Skills.SLAYER]: {
      rank: rankLevelExp[19][0],
      level: rankLevelExp[19][1],
      exp: rankLevelExp[19][2],
    },
    [Skills.FARM]: {
      rank: rankLevelExp[20][0],
      level: rankLevelExp[20][1],
      exp: rankLevelExp[20][2],
    },
    [Skills.RC]: {
      rank: rankLevelExp[21][0],
      level: rankLevelExp[21][1],
      exp: rankLevelExp[21][2],
    },
    [Skills.HUNT]: {
      rank: rankLevelExp[22][0],
      level: rankLevelExp[22][1],
      exp: rankLevelExp[22][2],
    },
    [Skills.CON]: {
      rank: rankLevelExp[23][0],
      level: rankLevelExp[23][1],
      exp: rankLevelExp[23][2],
    },
    [OsrsOther.LEAGUE]: {
      rank: rankLevelExp[24][0],
      score: rankLevelExp[24][1],
    },
    [OsrsOther.BH_HUNTER]: {
      rank: rankLevelExp[25][0],
      score: rankLevelExp[25][1],
    },
    [OsrsOther.BH_ROGUE]: {
      rank: rankLevelExp[26][0],
      score: rankLevelExp[26][1],
    },
    [Clues.ALL]: { rank: rankLevelExp[27][0], score: rankLevelExp[27][1] },
    [Clues.BEGINNER]: { rank: rankLevelExp[28][0], score: rankLevelExp[28][1] },
    [Clues.EASY]: { rank: rankLevelExp[29][0], score: rankLevelExp[29][1] },
    [Clues.MEDIUM]: { rank: rankLevelExp[30][0], score: rankLevelExp[30][1] },
    [Clues.HARD]: { rank: rankLevelExp[31][0], score: rankLevelExp[31][1] },
    [Clues.ELITE]: { rank: rankLevelExp[32][0], score: rankLevelExp[32][1] },
    [Clues.MASTER]: { rank: rankLevelExp[33][0], score: rankLevelExp[33][1] },
    [TempleOther.LMS]: {
      rank: rankLevelExp[34][0],
      score: rankLevelExp[34][1],
    },
    [OsrsOther.SOULWARS]: {
      rank: rankLevelExp[35][0],
      score: rankLevelExp[35][1],
    },
    [Bosses.SIRE]: { rank: rankLevelExp[36][0], score: rankLevelExp[36][1] },
    [Bosses.HYDRA]: {
      rank: rankLevelExp[37][0],
      score: rankLevelExp[37][1],
    },
    [Bosses.BARROWS]: {
      rank: rankLevelExp[38][0],
      score: rankLevelExp[38][1],
    },
    [Bosses.BRYOPHYTA]: {
      rank: rankLevelExp[39][0],
      score: rankLevelExp[39][1],
    },
    [Bosses.CALLISTO]: {
      rank: rankLevelExp[40][0],
      score: rankLevelExp[40][1],
    },
    [Bosses.CERBERUS]: {
      rank: rankLevelExp[41][0],
      score: rankLevelExp[41][1],
    },
    [Bosses.COX]: {
      rank: rankLevelExp[42][0],
      score: rankLevelExp[42][1],
    },
    [Bosses.COXCM]: {
      rank: rankLevelExp[43][0],
      score: rankLevelExp[43][1],
    },
    [Bosses.CHAOS_ELE]: {
      rank: rankLevelExp[44][0],
      score: rankLevelExp[44][1],
    },
    [Bosses.CHAOS_FANATIC]: {
      rank: rankLevelExp[45][0],
      score: rankLevelExp[45][1],
    },
    [Bosses.ZILYANA]: {
      rank: rankLevelExp[46][0],
      score: rankLevelExp[46][1],
    },
    [Bosses.CORP]: {
      rank: rankLevelExp[47][0],
      score: rankLevelExp[47][1],
    },
    [Bosses.CRAZY_ARCH]: {
      rank: rankLevelExp[48][0],
      score: rankLevelExp[48][1],
    },
    [Bosses.PRIME]: {
      rank: rankLevelExp[49][0],
      score: rankLevelExp[49][1],
    },
    [Bosses.REX]: {
      rank: rankLevelExp[50][0],
      score: rankLevelExp[50][1],
    },
    [Bosses.SUPREME]: {
      rank: rankLevelExp[51][0],
      score: rankLevelExp[51][1],
    },
    [Bosses.DER_ARCH]: {
      rank: rankLevelExp[52][0],
      score: rankLevelExp[52][1],
    },
    [Bosses.GRAARDOR]: {
      rank: rankLevelExp[53][0],
      score: rankLevelExp[53][1],
    },
    [Bosses.MOLE]: { rank: rankLevelExp[54][0], score: rankLevelExp[54][1] },
    [Bosses.GUARDIANS]: {
      rank: rankLevelExp[55][0],
      score: rankLevelExp[55][1],
    },
    [Bosses.HESPORI]: { rank: rankLevelExp[56][0], score: rankLevelExp[56][1] },
    [Bosses.KQ]: {
      rank: rankLevelExp[57][0],
      score: rankLevelExp[57][1],
    },
    [Bosses.KBD]: {
      rank: rankLevelExp[58][0],
      score: rankLevelExp[58][1],
    },
    [Bosses.KRAKEN]: { rank: rankLevelExp[59][0], score: rankLevelExp[59][1] },
    KreeArra: { rank: rankLevelExp[60][0], score: rankLevelExp[60][1] },
    [Bosses.KRIL]: {
      rank: rankLevelExp[61][0],
      score: rankLevelExp[61][1],
    },
    [Bosses.MIMIC]: { rank: rankLevelExp[62][0], score: rankLevelExp[62][1] },
    [Bosses.NIGHTMARE]: {
      rank: rankLevelExp[63][0],
      score: rankLevelExp[63][1],
    },
    [Bosses.OBOR]: { rank: rankLevelExp[64][0], score: rankLevelExp[64][1] },
    [Bosses.SARACHNIS]: {
      rank: rankLevelExp[65][0],
      score: rankLevelExp[65][1],
    },
    [Bosses.SCORPIA]: { rank: rankLevelExp[66][0], score: rankLevelExp[66][1] },
    [Bosses.SKOTIZO]: { rank: rankLevelExp[67][0], score: rankLevelExp[67][1] },
    [Bosses.TEMPO]: {
      rank: rankLevelExp[68][0],
      score: rankLevelExp[68][1],
    },
    [Bosses.GAUNTLET]: {
      rank: rankLevelExp[69][0],
      score: rankLevelExp[69][1],
    },
    [Bosses.CORR_GAUNTLET]: {
      rank: rankLevelExp[70][0],
      score: rankLevelExp[70][1],
    },

    [Bosses.TOB]: {
      rank: rankLevelExp[71][0],
      score: rankLevelExp[71][1],
    },
    [Bosses.THERMY]: {
      rank: rankLevelExp[72][0],
      score: rankLevelExp[72][1],
    },
    [Bosses.ZUK]: { rank: rankLevelExp[73][0], score: rankLevelExp[73][1] },
    [Bosses.JAD]: { rank: rankLevelExp[74][0], score: rankLevelExp[74][1] },
    [Bosses.VENE]: { rank: rankLevelExp[75][0], score: rankLevelExp[75][1] },
    [Bosses.VETION]: { rank: rankLevelExp[76][0], score: rankLevelExp[76][1] },
    [Bosses.VORKATH]: { rank: rankLevelExp[77][0], score: rankLevelExp[77][1] },
    [Bosses.WT]: { rank: rankLevelExp[78][0], score: rankLevelExp[78][1] },
    [Bosses.ZALCANO]: { rank: rankLevelExp[79][0], score: rankLevelExp[79][1] },
    [Bosses.ZULRAH]: { rank: rankLevelExp[80][0], score: rankLevelExp[80][1] },
  };
  return playerObject;
};
