import { OsrsPlayer } from '../../cache/osrsCache';

// Read: https://runescape.wiki/w/Application_programming_interface#Hiscores_Lite_2
export const osrsDataParser = (data: string) => {
  const stringToArray: string[] = data.split('\n');
  const rankLevelExpString = stringToArray.map((el: string) => {
    return el.split(',');
  });
  const rankLevelExp: number[][] = rankLevelExpString.map((el: string[]) => {
    return el.map((el: string) => {
      return parseInt(el);
    });
  });

  const playerObject: OsrsPlayer = {
    Overall: {
      rank: rankLevelExp[0][0],
      level: rankLevelExp[0][1],
      exp: rankLevelExp[0][2],
    },
    Attack: {
      rank: rankLevelExp[1][0],
      level: rankLevelExp[1][1],
      exp: rankLevelExp[1][2],
    },
    Defence: {
      rank: rankLevelExp[2][0],
      level: rankLevelExp[2][1],
      exp: rankLevelExp[2][2],
    },
    Strength: {
      rank: rankLevelExp[3][0],
      level: rankLevelExp[3][1],
      exp: rankLevelExp[3][2],
    },
    Hitpoints: {
      rank: rankLevelExp[4][0],
      level: rankLevelExp[4][1],
      exp: rankLevelExp[4][2],
    },
    Ranged: {
      rank: rankLevelExp[5][0],
      level: rankLevelExp[5][1],
      exp: rankLevelExp[5][2],
    },
    Prayer: {
      rank: rankLevelExp[6][0],
      level: rankLevelExp[6][1],
      exp: rankLevelExp[6][2],
    },
    Magic: {
      rank: rankLevelExp[7][0],
      level: rankLevelExp[7][1],
      exp: rankLevelExp[7][2],
    },
    Cooking: {
      rank: rankLevelExp[8][0],
      level: rankLevelExp[8][1],
      exp: rankLevelExp[8][2],
    },
    Woodcutting: {
      rank: rankLevelExp[9][0],
      level: rankLevelExp[9][1],
      exp: rankLevelExp[9][2],
    },
    Fletching: {
      rank: rankLevelExp[10][0],
      level: rankLevelExp[10][1],
      exp: rankLevelExp[10][2],
    },
    Fishing: {
      rank: rankLevelExp[11][0],
      level: rankLevelExp[11][1],
      exp: rankLevelExp[11][2],
    },
    Firemaking: {
      rank: rankLevelExp[12][0],
      level: rankLevelExp[12][1],
      exp: rankLevelExp[12][2],
    },
    Crafting: {
      rank: rankLevelExp[13][0],
      level: rankLevelExp[13][1],
      exp: rankLevelExp[13][2],
    },
    Smithing: {
      rank: rankLevelExp[14][0],
      level: rankLevelExp[14][1],
      exp: rankLevelExp[14][2],
    },
    Mining: {
      rank: rankLevelExp[15][0],
      level: rankLevelExp[15][1],
      exp: rankLevelExp[15][2],
    },
    Herblore: {
      rank: rankLevelExp[16][0],
      level: rankLevelExp[16][1],
      exp: rankLevelExp[16][2],
    },
    Agility: {
      rank: rankLevelExp[17][0],
      level: rankLevelExp[17][1],
      exp: rankLevelExp[17][2],
    },
    Thieving: {
      rank: rankLevelExp[18][0],
      level: rankLevelExp[18][1],
      exp: rankLevelExp[18][2],
    },
    Slayer: {
      rank: rankLevelExp[19][0],
      level: rankLevelExp[19][1],
      exp: rankLevelExp[19][2],
    },
    Farming: {
      rank: rankLevelExp[20][0],
      level: rankLevelExp[20][1],
      exp: rankLevelExp[20][2],
    },
    Runecrafting: {
      rank: rankLevelExp[21][0],
      level: rankLevelExp[21][1],
      exp: rankLevelExp[21][2],
    },
    Hunter: {
      rank: rankLevelExp[22][0],
      level: rankLevelExp[22][1],
      exp: rankLevelExp[22][2],
    },
    Construction: {
      rank: rankLevelExp[23][0],
      level: rankLevelExp[23][1],
      exp: rankLevelExp[23][2],
    },
    League_Points: {
      rank: rankLevelExp[24][0],
      score: rankLevelExp[24][1],
    },
    Bh_Hunter: { rank: rankLevelExp[25][0], score: rankLevelExp[25][1] },
    Bh_Rogue: { rank: rankLevelExp[26][0], score: rankLevelExp[26][1] },
    Clue_all: { rank: rankLevelExp[27][0], score: rankLevelExp[27][1] },
    Clue_beginner: { rank: rankLevelExp[28][0], score: rankLevelExp[28][1] },
    Clue_easy: { rank: rankLevelExp[29][0], score: rankLevelExp[29][1] },
    Clue_medium: { rank: rankLevelExp[30][0], score: rankLevelExp[30][1] },
    Clue_hard: { rank: rankLevelExp[31][0], score: rankLevelExp[31][1] },
    Clue_elite: { rank: rankLevelExp[32][0], score: rankLevelExp[32][1] },
    Clue_master: { rank: rankLevelExp[33][0], score: rankLevelExp[33][1] },
    Lms_Rank: { rank: rankLevelExp[34][0], score: rankLevelExp[34][1] },
    Soul_Wars_Zeal: { rank: rankLevelExp[35][0], score: rankLevelExp[35][1] },
    'Abyssal Sire': { rank: rankLevelExp[36][0], score: rankLevelExp[36][1] },
    'Alchemical Hydra': {
      rank: rankLevelExp[37][0],
      score: rankLevelExp[37][1],
    },
    'Barrows Chests': {
      rank: rankLevelExp[38][0],
      score: rankLevelExp[38][1],
    },
    Bryophyta: { rank: rankLevelExp[39][0], score: rankLevelExp[39][1] },
    Callisto: { rank: rankLevelExp[40][0], score: rankLevelExp[40][1] },
    Cerberus: { rank: rankLevelExp[41][0], score: rankLevelExp[41][1] },
    'Chambers of Xeric': {
      rank: rankLevelExp[42][0],
      score: rankLevelExp[42][1],
    },
    'Chambers of Xeric Challenge Mode': {
      rank: rankLevelExp[43][0],
      score: rankLevelExp[43][1],
    },
    'Chaos Elemental': {
      rank: rankLevelExp[44][0],
      score: rankLevelExp[44][1],
    },
    'Chaos Fanatic': {
      rank: rankLevelExp[45][0],
      score: rankLevelExp[45][1],
    },
    'Commander Zilyana': {
      rank: rankLevelExp[46][0],
      score: rankLevelExp[46][1],
    },
    'Corporeal Beast': {
      rank: rankLevelExp[47][0],
      score: rankLevelExp[47][1],
    },
    'Crazy Archaeologist': {
      rank: rankLevelExp[48][0],
      score: rankLevelExp[48][1],
    },
    'Dagannoth Prime': {
      rank: rankLevelExp[49][0],
      score: rankLevelExp[49][1],
    },
    'Dagannoth Rex': {
      rank: rankLevelExp[50][0],
      score: rankLevelExp[50][1],
    },
    'Dagannoth Supreme': {
      rank: rankLevelExp[51][0],
      score: rankLevelExp[51][1],
    },
    'Deranged Archaeologist': {
      rank: rankLevelExp[52][0],
      score: rankLevelExp[52][1],
    },
    'General Graardor': {
      rank: rankLevelExp[53][0],
      score: rankLevelExp[53][1],
    },
    'Giant Mole': { rank: rankLevelExp[54][0], score: rankLevelExp[54][1] },
    'Grotesque Guardians': {
      rank: rankLevelExp[55][0],
      score: rankLevelExp[55][1],
    },
    Hespori: { rank: rankLevelExp[56][0], score: rankLevelExp[56][1] },
    'Kalphite Queen': {
      rank: rankLevelExp[57][0],
      score: rankLevelExp[57][1],
    },
    'King Black Dragon': {
      rank: rankLevelExp[58][0],
      score: rankLevelExp[58][1],
    },
    Kraken: { rank: rankLevelExp[59][0], score: rankLevelExp[59][1] },
    KreeArra: { rank: rankLevelExp[60][0], score: rankLevelExp[60][1] },
    'Kril Tsutsaroth': {
      rank: rankLevelExp[61][0],
      score: rankLevelExp[61][1],
    },
    Mimic: { rank: rankLevelExp[62][0], score: rankLevelExp[62][1] },
    'The Nightmare': {
      rank: rankLevelExp[63][0],
      score: rankLevelExp[63][1],
    },
    Obor: { rank: rankLevelExp[64][0], score: rankLevelExp[64][1] },
    Sarachnis: { rank: rankLevelExp[65][0], score: rankLevelExp[65][1] },
    Scorpia: { rank: rankLevelExp[66][0], score: rankLevelExp[66][1] },
    Skotizo: { rank: rankLevelExp[67][0], score: rankLevelExp[67][1] },
    Tempoross: {
      rank: rankLevelExp[68][0],
      score: rankLevelExp[68][1],
    },
    'The Gauntlet': { rank: rankLevelExp[69][0], score: rankLevelExp[69][1] },
    'The Corrupted Gauntlet': {
      rank: rankLevelExp[70][0],
      score: rankLevelExp[70][1],
    },

    'Theatre of Blood': {
      rank: rankLevelExp[71][0],
      score: rankLevelExp[71][1],
    },
    'Thermonuclear Smoke Devil': {
      rank: rankLevelExp[72][0],
      score: rankLevelExp[72][1],
    },
    'TzKal-Zuk': { rank: rankLevelExp[73][0], score: rankLevelExp[73][1] },
    'TzTok-Jad': { rank: rankLevelExp[74][0], score: rankLevelExp[74][1] },
    Venenatis: { rank: rankLevelExp[75][0], score: rankLevelExp[75][1] },
    Vetion: { rank: rankLevelExp[76][0], score: rankLevelExp[76][1] },
    Vorkath: { rank: rankLevelExp[77][0], score: rankLevelExp[77][1] },
    Wintertodt: { rank: rankLevelExp[78][0], score: rankLevelExp[78][1] },
    Zalcano: { rank: rankLevelExp[79][0], score: rankLevelExp[79][1] },
    Zulrah: { rank: rankLevelExp[80][0], score: rankLevelExp[80][1] },
  };
  return playerObject;
};
