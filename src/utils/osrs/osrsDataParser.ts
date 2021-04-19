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
      [TempleOther.RANK]: rankLevelExp[0][0],
      [TempleOther.LEVEL]: rankLevelExp[0][1],
      [TempleOther.EXP]: rankLevelExp[0][2],
    },
    [Skills.ATT]: {
      [TempleOther.RANK]: rankLevelExp[1][0],
      [TempleOther.LEVEL]: rankLevelExp[1][1],
      [TempleOther.EXP]: rankLevelExp[1][2],
    },
    [Skills.DEF]: {
      [TempleOther.RANK]: rankLevelExp[2][0],
      [TempleOther.LEVEL]: rankLevelExp[2][1],
      [TempleOther.EXP]: rankLevelExp[2][2],
    },
    [Skills.STR]: {
      [TempleOther.RANK]: rankLevelExp[3][0],
      [TempleOther.LEVEL]: rankLevelExp[3][1],
      [TempleOther.EXP]: rankLevelExp[3][2],
    },
    [Skills.HP]: {
      [TempleOther.RANK]: rankLevelExp[4][0],
      [TempleOther.LEVEL]: rankLevelExp[4][1],
      [TempleOther.EXP]: rankLevelExp[4][2],
    },
    [Skills.RANGED]: {
      [TempleOther.RANK]: rankLevelExp[5][0],
      [TempleOther.LEVEL]: rankLevelExp[5][1],
      [TempleOther.EXP]: rankLevelExp[5][2],
    },
    [Skills.PRAY]: {
      [TempleOther.RANK]: rankLevelExp[6][0],
      [TempleOther.LEVEL]: rankLevelExp[6][1],
      [TempleOther.EXP]: rankLevelExp[6][2],
    },
    [Skills.MAGIC]: {
      [TempleOther.RANK]: rankLevelExp[7][0],
      [TempleOther.LEVEL]: rankLevelExp[7][1],
      [TempleOther.EXP]: rankLevelExp[7][2],
    },
    [Skills.COOK]: {
      [TempleOther.RANK]: rankLevelExp[8][0],
      [TempleOther.LEVEL]: rankLevelExp[8][1],
      [TempleOther.EXP]: rankLevelExp[8][2],
    },
    [Skills.WC]: {
      [TempleOther.RANK]: rankLevelExp[9][0],
      [TempleOther.LEVEL]: rankLevelExp[9][1],
      [TempleOther.EXP]: rankLevelExp[9][2],
    },
    [Skills.FLETCH]: {
      [TempleOther.RANK]: rankLevelExp[10][0],
      [TempleOther.LEVEL]: rankLevelExp[10][1],
      [TempleOther.EXP]: rankLevelExp[10][2],
    },
    [Skills.FISH]: {
      [TempleOther.RANK]: rankLevelExp[11][0],
      [TempleOther.LEVEL]: rankLevelExp[11][1],
      [TempleOther.EXP]: rankLevelExp[11][2],
    },
    [Skills.FM]: {
      [TempleOther.RANK]: rankLevelExp[12][0],
      [TempleOther.LEVEL]: rankLevelExp[12][1],
      [TempleOther.EXP]: rankLevelExp[12][2],
    },
    [Skills.CRAFT]: {
      [TempleOther.RANK]: rankLevelExp[13][0],
      [TempleOther.LEVEL]: rankLevelExp[13][1],
      [TempleOther.EXP]: rankLevelExp[13][2],
    },
    [Skills.SMITH]: {
      [TempleOther.RANK]: rankLevelExp[14][0],
      [TempleOther.LEVEL]: rankLevelExp[14][1],
      [TempleOther.EXP]: rankLevelExp[14][2],
    },
    [Skills.MINING]: {
      [TempleOther.RANK]: rankLevelExp[15][0],
      [TempleOther.LEVEL]: rankLevelExp[15][1],
      [TempleOther.EXP]: rankLevelExp[15][2],
    },
    [Skills.HERB]: {
      [TempleOther.RANK]: rankLevelExp[16][0],
      [TempleOther.LEVEL]: rankLevelExp[16][1],
      [TempleOther.EXP]: rankLevelExp[16][2],
    },
    [Skills.AGIL]: {
      [TempleOther.RANK]: rankLevelExp[17][0],
      [TempleOther.LEVEL]: rankLevelExp[17][1],
      [TempleOther.EXP]: rankLevelExp[17][2],
    },
    [Skills.THIEV]: {
      [TempleOther.RANK]: rankLevelExp[18][0],
      [TempleOther.LEVEL]: rankLevelExp[18][1],
      [TempleOther.EXP]: rankLevelExp[18][2],
    },
    [Skills.SLAYER]: {
      [TempleOther.RANK]: rankLevelExp[19][0],
      [TempleOther.LEVEL]: rankLevelExp[19][1],
      [TempleOther.EXP]: rankLevelExp[19][2],
    },
    [Skills.FARM]: {
      [TempleOther.RANK]: rankLevelExp[20][0],
      [TempleOther.LEVEL]: rankLevelExp[20][1],
      [TempleOther.EXP]: rankLevelExp[20][2],
    },
    [Skills.RC]: {
      [TempleOther.RANK]: rankLevelExp[21][0],
      [TempleOther.LEVEL]: rankLevelExp[21][1],
      [TempleOther.EXP]: rankLevelExp[21][2],
    },
    [Skills.HUNT]: {
      [TempleOther.RANK]: rankLevelExp[22][0],
      [TempleOther.LEVEL]: rankLevelExp[22][1],
      [TempleOther.EXP]: rankLevelExp[22][2],
    },
    [Skills.CON]: {
      [TempleOther.RANK]: rankLevelExp[23][0],
      [TempleOther.LEVEL]: rankLevelExp[23][1],
      [TempleOther.EXP]: rankLevelExp[23][2],
    },
    [OsrsOther.LEAGUE]: {
      [TempleOther.RANK]: rankLevelExp[24][0],
      [TempleOther.SCORE]: rankLevelExp[24][1],
    },
    [OsrsOther.BH_HUNTER]: {
      [TempleOther.RANK]: rankLevelExp[25][0],
      [TempleOther.SCORE]: rankLevelExp[25][1],
    },
    [OsrsOther.BH_ROGUE]: {
      [TempleOther.RANK]: rankLevelExp[26][0],
      [TempleOther.SCORE]: rankLevelExp[26][1],
    },
    [Clues.ALL]: {
      [TempleOther.RANK]: rankLevelExp[27][0],
      [TempleOther.SCORE]: rankLevelExp[27][1],
    },
    [Clues.BEGINNER]: {
      [TempleOther.RANK]: rankLevelExp[28][0],
      [TempleOther.SCORE]: rankLevelExp[28][1],
    },
    [Clues.EASY]: {
      [TempleOther.RANK]: rankLevelExp[29][0],
      [TempleOther.SCORE]: rankLevelExp[29][1],
    },
    [Clues.MEDIUM]: {
      [TempleOther.RANK]: rankLevelExp[30][0],
      [TempleOther.SCORE]: rankLevelExp[30][1],
    },
    [Clues.HARD]: {
      [TempleOther.RANK]: rankLevelExp[31][0],
      [TempleOther.SCORE]: rankLevelExp[31][1],
    },
    [Clues.ELITE]: {
      [TempleOther.RANK]: rankLevelExp[32][0],
      [TempleOther.SCORE]: rankLevelExp[32][1],
    },
    [Clues.MASTER]: {
      [TempleOther.RANK]: rankLevelExp[33][0],
      [TempleOther.SCORE]: rankLevelExp[33][1],
    },
    [TempleOther.LMS]: {
      [TempleOther.RANK]: rankLevelExp[34][0],
      [TempleOther.SCORE]: rankLevelExp[34][1],
    },
    [OsrsOther.SOULWARS]: {
      [TempleOther.RANK]: rankLevelExp[35][0],
      [TempleOther.SCORE]: rankLevelExp[35][1],
    },
    [Bosses.SIRE]: {
      [TempleOther.RANK]: rankLevelExp[36][0],
      [TempleOther.SCORE]: rankLevelExp[36][1],
    },
    [Bosses.HYDRA]: {
      [TempleOther.RANK]: rankLevelExp[37][0],
      [TempleOther.SCORE]: rankLevelExp[37][1],
    },
    [Bosses.BARROWS]: {
      [TempleOther.RANK]: rankLevelExp[38][0],
      [TempleOther.SCORE]: rankLevelExp[38][1],
    },
    [Bosses.BRYOPHYTA]: {
      [TempleOther.RANK]: rankLevelExp[39][0],
      [TempleOther.SCORE]: rankLevelExp[39][1],
    },
    [Bosses.CALLISTO]: {
      [TempleOther.RANK]: rankLevelExp[40][0],
      [TempleOther.SCORE]: rankLevelExp[40][1],
    },
    [Bosses.CERBERUS]: {
      [TempleOther.RANK]: rankLevelExp[41][0],
      [TempleOther.SCORE]: rankLevelExp[41][1],
    },
    [Bosses.COX]: {
      [TempleOther.RANK]: rankLevelExp[42][0],
      [TempleOther.SCORE]: rankLevelExp[42][1],
    },
    [Bosses.COXCM]: {
      [TempleOther.RANK]: rankLevelExp[43][0],
      [TempleOther.SCORE]: rankLevelExp[43][1],
    },
    [Bosses.CHAOS_ELE]: {
      [TempleOther.RANK]: rankLevelExp[44][0],
      [TempleOther.SCORE]: rankLevelExp[44][1],
    },
    [Bosses.CHAOS_FANATIC]: {
      [TempleOther.RANK]: rankLevelExp[45][0],
      [TempleOther.SCORE]: rankLevelExp[45][1],
    },
    [Bosses.ZILYANA]: {
      [TempleOther.RANK]: rankLevelExp[46][0],
      [TempleOther.SCORE]: rankLevelExp[46][1],
    },
    [Bosses.CORP]: {
      [TempleOther.RANK]: rankLevelExp[47][0],
      [TempleOther.SCORE]: rankLevelExp[47][1],
    },
    [Bosses.CRAZY_ARCH]: {
      [TempleOther.RANK]: rankLevelExp[48][0],
      [TempleOther.SCORE]: rankLevelExp[48][1],
    },
    [Bosses.PRIME]: {
      [TempleOther.RANK]: rankLevelExp[49][0],
      [TempleOther.SCORE]: rankLevelExp[49][1],
    },
    [Bosses.REX]: {
      [TempleOther.RANK]: rankLevelExp[50][0],
      [TempleOther.SCORE]: rankLevelExp[50][1],
    },
    [Bosses.SUPREME]: {
      [TempleOther.RANK]: rankLevelExp[51][0],
      [TempleOther.SCORE]: rankLevelExp[51][1],
    },
    [Bosses.DER_ARCH]: {
      [TempleOther.RANK]: rankLevelExp[52][0],
      [TempleOther.SCORE]: rankLevelExp[52][1],
    },
    [Bosses.GRAARDOR]: {
      [TempleOther.RANK]: rankLevelExp[53][0],
      [TempleOther.SCORE]: rankLevelExp[53][1],
    },
    [Bosses.MOLE]: {
      [TempleOther.RANK]: rankLevelExp[54][0],
      [TempleOther.SCORE]: rankLevelExp[54][1],
    },
    [Bosses.GUARDIANS]: {
      [TempleOther.RANK]: rankLevelExp[55][0],
      [TempleOther.SCORE]: rankLevelExp[55][1],
    },
    [Bosses.HESPORI]: {
      [TempleOther.RANK]: rankLevelExp[56][0],
      [TempleOther.SCORE]: rankLevelExp[56][1],
    },
    [Bosses.KQ]: {
      [TempleOther.RANK]: rankLevelExp[57][0],
      [TempleOther.SCORE]: rankLevelExp[57][1],
    },
    [Bosses.KBD]: {
      [TempleOther.RANK]: rankLevelExp[58][0],
      [TempleOther.SCORE]: rankLevelExp[58][1],
    },
    [Bosses.KRAKEN]: {
      [TempleOther.RANK]: rankLevelExp[59][0],
      [TempleOther.SCORE]: rankLevelExp[59][1],
    },
    KreeArra: {
      [TempleOther.RANK]: rankLevelExp[60][0],
      [TempleOther.SCORE]: rankLevelExp[60][1],
    },
    [Bosses.KRIL]: {
      [TempleOther.RANK]: rankLevelExp[61][0],
      [TempleOther.SCORE]: rankLevelExp[61][1],
    },
    [Bosses.MIMIC]: {
      [TempleOther.RANK]: rankLevelExp[62][0],
      [TempleOther.SCORE]: rankLevelExp[62][1],
    },
    [Bosses.NIGHTMARE]: {
      [TempleOther.RANK]: rankLevelExp[63][0],
      [TempleOther.SCORE]: rankLevelExp[63][1],
    },
    [Bosses.OBOR]: {
      [TempleOther.RANK]: rankLevelExp[64][0],
      [TempleOther.SCORE]: rankLevelExp[64][1],
    },
    [Bosses.SARACHNIS]: {
      [TempleOther.RANK]: rankLevelExp[65][0],
      [TempleOther.SCORE]: rankLevelExp[65][1],
    },
    [Bosses.SCORPIA]: {
      [TempleOther.RANK]: rankLevelExp[66][0],
      [TempleOther.SCORE]: rankLevelExp[66][1],
    },
    [Bosses.SKOTIZO]: {
      [TempleOther.RANK]: rankLevelExp[67][0],
      [TempleOther.SCORE]: rankLevelExp[67][1],
    },
    [Bosses.TEMPO]: {
      [TempleOther.RANK]: rankLevelExp[68][0],
      [TempleOther.SCORE]: rankLevelExp[68][1],
    },
    [Bosses.GAUNTLET]: {
      [TempleOther.RANK]: rankLevelExp[69][0],
      [TempleOther.SCORE]: rankLevelExp[69][1],
    },
    [Bosses.CORR_GAUNTLET]: {
      [TempleOther.RANK]: rankLevelExp[70][0],
      [TempleOther.SCORE]: rankLevelExp[70][1],
    },

    [Bosses.TOB]: {
      [TempleOther.RANK]: rankLevelExp[71][0],
      [TempleOther.SCORE]: rankLevelExp[71][1],
    },
    [Bosses.THERMY]: {
      [TempleOther.RANK]: rankLevelExp[72][0],
      [TempleOther.SCORE]: rankLevelExp[72][1],
    },
    [Bosses.ZUK]: {
      [TempleOther.RANK]: rankLevelExp[73][0],
      [TempleOther.SCORE]: rankLevelExp[73][1],
    },
    [Bosses.JAD]: {
      [TempleOther.RANK]: rankLevelExp[74][0],
      [TempleOther.SCORE]: rankLevelExp[74][1],
    },
    [Bosses.VENE]: {
      [TempleOther.RANK]: rankLevelExp[75][0],
      [TempleOther.SCORE]: rankLevelExp[75][1],
    },
    [Bosses.VETION]: {
      [TempleOther.RANK]: rankLevelExp[76][0],
      [TempleOther.SCORE]: rankLevelExp[76][1],
    },
    [Bosses.VORKATH]: {
      [TempleOther.RANK]: rankLevelExp[77][0],
      [TempleOther.SCORE]: rankLevelExp[77][1],
    },
    [Bosses.WT]: {
      [TempleOther.RANK]: rankLevelExp[78][0],
      [TempleOther.SCORE]: rankLevelExp[78][1],
    },
    [Bosses.ZALCANO]: {
      [TempleOther.RANK]: rankLevelExp[79][0],
      [TempleOther.SCORE]: rankLevelExp[79][1],
    },
    [Bosses.ZULRAH]: {
      [TempleOther.RANK]: rankLevelExp[80][0],
      [TempleOther.SCORE]: rankLevelExp[80][1],
    },
  };
  return playerObject;
};
