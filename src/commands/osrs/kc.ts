import { Message } from 'discord.js';
import { OsrsEmbed, OsrsEmbedTitles, usernameString } from '../../utils/embed';
import {
  fetchOsrsStats,
  osrsStats,
  OsrsPlayer,
  BossOrMinigame,
} from '../../cache/osrsCache';
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
import { argumentParser, ParserTypes } from '../../utils/argumentParser';
import { isOnCooldown } from '../../cache/cooldown';
import { BOSS_LIST } from '../../utils/osrs/isPrefixValid';

export const kc = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  /*First check if boss list includes first arg, if false return error. If true, check if it includes first and second argument joined as a string, if false then boss = first argument and user = args without first argument. If true then boss = argument one and two joined and user = args without both arguments. There is also a check for edge cases like ".kc corrupted gauntlet". Both checks pass but there is no third argument. In such case I assume the result user is looking for is ".kc corrupted gauntlet gauntlet", so basically gauntlet is player's name.  
  
  Example1: .kc zulrah player one
  First check will pass (zulrah is valid boss) then second check (zulrayplayer) will fail and boss will be = zulrah
  
  Example2: .kc cox cm player one
  First check will pass (cox is valid boss) then second check (coxcm) will pass and boss will be = coxm

  Example3: .kc dagannoth supreme player one
  First check will pass coz there are three bosses with dagannoth in their name. Then second check will pass because dagannothsupreme is a valid boss. Boss will be = dagannothsupreme
  
  */

  const firstArgument: string = args[0];
  const twoArgumentsJoined: string = [args[0], args[1]].join('');
  let boss: string;
  let user: string[];
  const firstCheck: string[] = bosses.filter((e: string) => {
    return e.includes(firstArgument);
  });
  if (firstCheck.length > 0) {
    const secondCheck = bosses.filter((e: string) => {
      return e.includes(twoArgumentsJoined);
    });
    if (secondCheck.length > 0 && args.length === 2) {
      boss = firstArgument;
      user = args.slice(1);
    } else if (secondCheck.length > 0) {
      boss = twoArgumentsJoined;
      user = args.slice(2);
    } else {
      boss = firstArgument;
      user = args.slice(1);
    }
  } else {
    return msg.channel.send(
      `Invalid boss name. Valid boss names: <${BOSS_LIST}>`
    );
  }

  const cooldown: number = 30;
  if (isOnCooldown(msg, commandName, cooldown, false, args) === true) return;
  const nameCheck: boolean = runescapeNameValidator(user);
  if (nameCheck === false) return msg.channel.send(invalidUsername);
  const usernameWithSpaces: string = argumentParser(user, 0, ParserTypes.OSRS);
  const embed: OsrsEmbed = new OsrsEmbed()
    .setTitle(OsrsEmbedTitles.KC)
    .addField(usernameString, `${usernameWithSpaces}`);
  if (usernameWithSpaces in osrsStats) {
    const result = generateResult(boss, embed, osrsStats[usernameWithSpaces]);
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchOsrsStats(msg, usernameWithSpaces);
    if (isFetched === true) {
      const result = generateResult(boss, embed, osrsStats[usernameWithSpaces]);
      return msg.channel.send(result);
    } else return;
  }
};

// Generates embed sent to user
const generateResult = (
  inputPrefix: string,
  inputEmbed: OsrsEmbed,
  playerObject: OsrsPlayer
): OsrsEmbed => {
  const prefix: string = inputPrefix;
  const embed: OsrsEmbed = inputEmbed;
  const player: OsrsPlayer = playerObject;
  const boss: {
    bossKc: BossOrMinigame;
    bossName: string;
  } = bossTypeCheck(prefix, player);
  embed.addField(`${boss.bossName} kills`, `${boss.bossKc.score}`);

  return embed;
};

const bossTypeCheck = (
  prefix: string,
  playerObject: OsrsPlayer
): {
  bossKc: BossOrMinigame;
  bossName: string;
} => {
  const type: string = prefix;
  const playerStats = playerObject;
  let bossKc: BossOrMinigame;
  let bossName: string;

  switch (type) {
    case 'abyssalsire':
      bossKc = playerStats[Bosses.SIRE];
      bossName = Bosses.SIRE;
      break;
    case 'sire':
      bossKc = playerStats[Bosses.SIRE];
      bossName = Bosses.SIRE;
      break;
    case 'alchemicalhydra':
      bossKc = playerStats[Bosses.HYDRA];
      bossName = Bosses.HYDRA;
      break;
    case 'hydra':
      bossKc = playerStats[Bosses.HYDRA];
      bossName = Bosses.HYDRA;
      break;
    case 'barrows':
      bossKc = playerStats[Bosses.BARROWS];
      bossName = Bosses.BARROWS;
      break;
    case 'bryo':
      bossKc = playerStats[Bosses.BRYOPHYTA];
      bossName = Bosses.BRYOPHYTA;
      break;
    case 'bryophyta':
      bossKc = playerStats[Bosses.BRYOPHYTA];
      bossName = Bosses.BRYOPHYTA;
      break;
    case 'callisto':
      bossKc = playerStats[Bosses.CALLISTO];
      bossName = Bosses.CALLISTO;
      break;
    case 'cerberus':
      bossKc = playerStats[Bosses.CERBERUS];
      bossName = Bosses.CERBERUS;
      break;
    case 'cerb':
      bossKc = playerStats[Bosses.CERBERUS];
      bossName = Bosses.CERBERUS;
      break;
    case 'cox':
      bossKc = playerStats[Bosses.COX];
      bossName = Bosses.COX;
      break;
    case 'chambers':
      bossKc = playerStats[Bosses.COX];
      bossName = Bosses.COX;
      break;
    case 'cm':
      bossKc = playerStats[Bosses.COXCM];
      bossName = Bosses.COXCM;
      break;
    case 'coxcm':
      bossKc = playerStats[Bosses.COXCM];
      bossName = Bosses.COXCM;
      break;
    case 'challengemode':
      bossKc = playerStats[Bosses.COXCM];
      bossName = Bosses.COXCM;
      break;
    case 'ele':
      bossKc = playerStats[Bosses.CHAOS_ELE];
      bossName = Bosses.CHAOS_ELE;
      break;
    case 'chaosele':
      bossKc = playerStats[Bosses.CHAOS_ELE];
      bossName = Bosses.CHAOS_ELE;
      break;
    case 'chaoselemental':
      bossKc = playerStats[Bosses.CHAOS_ELE];
      bossName = Bosses.CHAOS_ELE;
      break;
    case 'fanatic':
      bossKc = playerStats[Bosses.CHAOS_FANATIC];
      bossName = Bosses.CHAOS_FANATIC;
      break;
    case 'chaosfanatic':
      bossKc = playerStats[Bosses.CHAOS_FANATIC];
      bossName = Bosses.CHAOS_FANATIC;
      break;
    case 'fanatic':
      bossKc = playerStats[Bosses.CHAOS_FANATIC];
      bossName = Bosses.CHAOS_FANATIC;
      break;
    case 'sara':
      bossKc = playerStats[Bosses.ZILYANA];
      bossName = Bosses.ZILYANA;
      break;
    case 'saradomin':
      bossKc = playerStats[Bosses.ZILYANA];
      bossName = Bosses.ZILYANA;
      break;
    case 'zilyana':
      bossKc = playerStats[Bosses.ZILYANA];
      bossName = Bosses.ZILYANA;
      break;
    case 'zilly':
      bossKc = playerStats[Bosses.ZILYANA];
      bossName = Bosses.ZILYANA;
      break;
    case 'corp':
      bossKc = playerStats[Bosses.CORP];
      bossName = Bosses.CORP;
      break;
    case 'crazyarch':
      bossKc = playerStats[Bosses.CRAZY_ARCH];
      bossName = Bosses.CRAZY_ARCH;
      break;
    case 'crazyarcheologist':
      bossKc = playerStats[Bosses.CRAZY_ARCH];
      bossName = Bosses.CRAZY_ARCH;
      break;
    case 'prime':
      bossKc = playerStats[Bosses.PRIME];
      bossName = Bosses.PRIME;
      break;
    case 'dagannothprime':
      bossKc = playerStats[Bosses.PRIME];
      bossName = Bosses.PRIME;
      break;
    case 'rex':
      bossKc = playerStats[Bosses.REX];
      bossName = Bosses.REX;
      break;
    case 'dagannothrex':
      bossKc = playerStats[Bosses.REX];
      bossName = Bosses.REX;
      break;
    case 'supreme':
      bossKc = playerStats[Bosses.SUPREME];
      bossName = Bosses.SUPREME;
      break;
    case 'dagannothsupreme':
      bossKc = playerStats[Bosses.SUPREME];
      bossName = Bosses.SUPREME;
      break;
    case 'derangedarch':
      bossKc = playerStats[Bosses.DER_ARCH];
      bossName = Bosses.DER_ARCH;
      break;
    case 'derangedarcheologist':
      bossKc = playerStats[Bosses.DER_ARCH];
      bossName = Bosses.DER_ARCH;
      break;
    case 'deranged':
      bossKc = playerStats[Bosses.DER_ARCH];
      bossName = Bosses.DER_ARCH;
      break;
    case 'graardor':
      bossKc = playerStats[Bosses.GRAARDOR];
      bossName = Bosses.GRAARDOR;
      break;
    case 'bandos':
      bossKc = playerStats[Bosses.GRAARDOR];
      bossName = Bosses.GRAARDOR;
      break;
    case 'mole':
      bossKc = playerStats[Bosses.MOLE];
      bossName = Bosses.MOLE;
      break;
    case 'guardians':
      bossKc = playerStats[Bosses.GUARDIANS];
      bossName = Bosses.GUARDIANS;
      break;
    case 'gg':
      bossKc = playerStats[Bosses.GUARDIANS];
      bossName = Bosses.GUARDIANS;
      break;
    case 'grotesque':
      bossKc = playerStats[Bosses.GUARDIANS];
      bossName = Bosses.GUARDIANS;
      break;
    case 'noon':
      bossKc = playerStats[Bosses.GUARDIANS];
      bossName = Bosses.GUARDIANS;
      break;
    case 'dusk':
      bossKc = playerStats[Bosses.GUARDIANS];
      bossName = Bosses.GUARDIANS;
      break;
    case 'hespori':
      bossKc = playerStats[Bosses.GUARDIANS];
      bossName = Bosses.GUARDIANS;
      break;
    case 'kq':
      bossKc = playerStats[Bosses.KQ];
      bossName = Bosses.KQ;
      break;
    case 'kalphite':
      bossKc = playerStats[Bosses.KQ];
      bossName = Bosses.KQ;
      break;
    case 'kalphitequeen':
      bossKc = playerStats[Bosses.KQ];
      bossName = Bosses.KQ;
      break;
    case 'kbd':
      bossKc = playerStats[Bosses.KBD];
      bossName = Bosses.KBD;
      break;
    case 'kraken':
      bossKc = playerStats[Bosses.KRAKEN];
      bossName = Bosses.KRAKEN;
      break;
    case 'kree':
      bossKc = playerStats[Bosses.KREE];
      bossName = Bosses.KREE;
      break;
    case `kree'arra`:
      bossKc = playerStats[Bosses.KREE];
      bossName = Bosses.KREE;
      break;
    case 'kreearra':
      bossKc = playerStats[Bosses.KREE];
      bossName = Bosses.KREE;
      break;
    case 'arma':
      bossKc = playerStats[Bosses.KREE];
      bossName = Bosses.KREE;
      break;
    case 'armadyl':
      bossKc = playerStats[Bosses.KREE];
      bossName = Bosses.KREE;
      break;
    case 'kril':
      bossKc = playerStats[Bosses.KRIL];
      bossName = Bosses.KRIL;
      break;
    case `k'ril`:
      bossKc = playerStats[Bosses.KRIL];
      bossName = Bosses.KRIL;
      break;
    case 'zammy':
      bossKc = playerStats[Bosses.KRIL];
      bossName = Bosses.KRIL;
      break;
    case 'zamorak':
      bossKc = playerStats[Bosses.KRIL];
      bossName = Bosses.KRIL;
      break;
    case 'kriltsutsaroth':
      bossKc = playerStats[Bosses.KRIL];
      bossName = Bosses.KRIL;
      break;
    case 'mimic':
      bossKc = playerStats[Bosses.MIMIC];
      bossName = Bosses.MIMIC;
      break;
    case 'nightmare':
      bossKc = playerStats[Bosses.NIGHTMARE];
      bossName = Bosses.NIGHTMARE;
      break;
    case 'obor':
      bossKc = playerStats[Bosses.OBOR];
      bossName = Bosses.OBOR;
      break;
    case 'sarachnis':
      bossKc = playerStats[Bosses.SARACHNIS];
      bossName = Bosses.SARACHNIS;
      break;
    case 'scorpia':
      bossKc = playerStats[Bosses.SCORPIA];
      bossName = Bosses.SCORPIA;
      break;
    case 'skotizo':
      bossKc = playerStats[Bosses.SKOTIZO];
      bossName = Bosses.SKOTIZO;
      break;
    case 'tempoross':
      bossKc = playerStats[Bosses.TEMPO];
      bossName = Bosses.TEMPO;
      break;
    case 'temp':
      bossKc = playerStats[Bosses.TEMPO];
      bossName = Bosses.TEMPO;
      break;
    case 'gauntlet':
      bossKc = playerStats[Bosses.GAUNTLET];
      bossName = Bosses.GAUNTLET;
      break;
    case 'hunllef':
      bossKc = playerStats[Bosses.GAUNTLET];
      bossName = Bosses.GAUNTLET;
      break;
    case 'corrgauntlet':
      bossKc = playerStats[Bosses.CORR_GAUNTLET];
      bossName = Bosses.CORR_GAUNTLET;
      break;
    case 'corruptedgauntlet':
      bossKc = playerStats[Bosses.CORR_GAUNTLET];
      bossName = Bosses.CORR_GAUNTLET;
      break;
    case 'corr':
      bossKc = playerStats[Bosses.CORR_GAUNTLET];
      bossName = Bosses.CORR_GAUNTLET;
      break;
    case 'corrupted':
      bossKc = playerStats[Bosses.CORR_GAUNTLET];
      bossName = Bosses.CORR_GAUNTLET;
      break;
    case 'corrhunllef':
      bossKc = playerStats[Bosses.CORR_GAUNTLET];
      bossName = Bosses.CORR_GAUNTLET;
      break;
    case 'tob':
      bossKc = playerStats[Bosses.TOB];
      bossName = Bosses.TOB;
      break;
    case 'theatre':
      bossKc = playerStats[Bosses.TOB];
      bossName = Bosses.TOB;
      break;
    case 'thermy':
      bossKc = playerStats[Bosses.THERMY];
      bossName = Bosses.THERMY;
      break;
    case 'thermonuclear':
      bossKc = playerStats[Bosses.THERMY];
      bossName = Bosses.THERMY;
      break;
    case 'zuk':
      bossKc = playerStats[Bosses.ZUK];
      bossName = Bosses.ZUK;
      break;
    case 'inferno':
      bossKc = playerStats[Bosses.ZUK];
      bossName = Bosses.ZUK;
      break;
    case 'jad':
      bossKc = playerStats[Bosses.JAD];
      bossName = Bosses.JAD;
      break;
    case 'fightcaves':
      bossKc = playerStats[Bosses.JAD];
      bossName = Bosses.JAD;
      break;
    case 'venenatis':
      bossKc = playerStats[Bosses.VENE];
      bossName = Bosses.VENE;
      break;
    case 'vene':
      bossKc = playerStats[Bosses.VENE];
      bossName = Bosses.VENE;
      break;
    case 'vetion':
      bossKc = playerStats[Bosses.VETION];
      bossName = Bosses.VETION;
      break;
    case 'vork':
      bossKc = playerStats[Bosses.VORKATH];
      bossName = Bosses.VORKATH;
      break;
    case 'vorkath':
      bossKc = playerStats[Bosses.VORKATH];
      bossName = Bosses.VORKATH;
      break;
    case 'wt':
      bossKc = playerStats[Bosses.WT];
      bossName = Bosses.WT;
      break;
    case 'wintertodt':
      bossKc = playerStats[Bosses.WT];
      bossName = Bosses.WT;
      break;
    case 'zalc':
      bossKc = playerStats[Bosses.ZALCANO];
      bossName = Bosses.ZALCANO;
      break;
    case 'zalcano':
      bossKc = playerStats[Bosses.ZALCANO];
      bossName = Bosses.ZALCANO;
      break;
    case 'zulrah':
      bossKc = playerStats[Bosses.ZULRAH];
      bossName = Bosses.ZULRAH;
      break;
    default:
      bossKc = {
        rank: 'Unranked',
        score: 'Unranked',
      };
      bossName = '';
  }
  return {
    bossKc,
    bossName,
  };
};

// Boss key names
enum Bosses {
  SIRE = 'Abyssal Sire',
  HYDRA = 'Alchemical Hydra',
  BARROWS = 'Barrows Chests',
  BRYOPHYTA = 'Bryophyta',
  CALLISTO = 'Callisto',
  CERBERUS = 'Cerberus',
  COX = 'Chambers of Xeric',
  COXCM = 'Chambers of Xeric Challenge Mode',
  CHAOS_ELE = 'Chaos Elemental',
  CHAOS_FANATIC = 'Chaos Fanatic',
  ZILYANA = 'Commander Zilyana',
  CORP = 'Corporeal Beast',
  CRAZY_ARCH = 'Crazy Archaeologist',
  PRIME = 'Dagannoth Prime',
  REX = 'Dagannoth Rex',
  SUPREME = 'Dagannoth Supreme',
  DER_ARCH = 'Deranged Archaeologist',
  GRAARDOR = 'General Graardor',
  MOLE = 'Giant Mole',
  GUARDIANS = 'Grotesque Guardians',
  HESPORI = 'Hespori',
  KQ = 'Kalphite Queen',
  KBD = 'King Black Dragon',
  KRAKEN = 'Kraken',
  KREE = 'KreeArra',
  KRIL = 'Kril Tsutsaroth',
  MIMIC = 'Mimic',
  NIGHTMARE = 'The Nightmare',
  OBOR = 'Obor',
  SARACHNIS = 'Sarachnis',
  SCORPIA = 'Scorpia',
  SKOTIZO = 'Skotizo',
  TEMPO = 'Tempoross',
  GAUNTLET = 'The Gauntlet',
  CORR_GAUNTLET = 'The Corrupted Gauntlet',
  TOB = 'Theatre of Blood',
  THERMY = 'Thermonuclear Smoke Devil',
  ZUK = 'TzKal-Zuk',
  JAD = 'TzTok-Jad',
  VENE = 'Venenatis',
  VETION = 'Vetion',
  VORKATH = 'Vorkath',
  WT = 'Wintertodt',
  ZALCANO = 'Zalcano',
  ZULRAH = 'Zulrah',
}

const bosses: string[] = [
  'abyssalsire',
  'sire',
  'alchemicalhydra',
  'hydra',
  'barrows',
  'bryo',
  'bryophyta',
  'callisto',
  'cerberus',
  'cerb',
  'cox',
  'chambers',
  'cm',
  'coxcm',
  'ele',
  'chaosele',
  'chaoselemental',
  'fanatic',
  'chaosfanatic',
  'fanatic',
  'sara',
  'saradomin',
  'zilyana',
  'zilly',
  'corp',
  'crazyarch',
  'crazyarcheologist',
  'prime',
  'dagannothprime',
  'rex',
  'dagannothrex',
  'challengemode',
  'supreme',
  'dagannothsupreme',
  'derangedarcheologist',
  'derangedarch',
  'deranged',
  'graardor',
  'bandos',
  'mole',
  'guardians',
  'gg',
  'grotesque',
  'noon',
  'dusk',
  'hespori',
  'kq',
  'kalphite',
  'kalphitequeen',
  'kbd',
  'kraken',
  'kree',
  `kree'arra`,
  'kreearra',
  'arma',
  'armadyl',
  `k'ril`,
  'kril',
  'zammy',
  'zamorak',
  'kriltsutsaroth',
  'mimic',
  'nightmare',
  'obor',
  'sarachnis',
  'scorpia',
  'skotizo',
  'tempoross',
  'temp',
  'gauntlet',
  'hunllef',
  'corrgauntlet',
  'corruptedgauntlet',
  'corr',
  'corrupted',
  'corrhunllef',
  'tob',
  'theatre',
  'thermy',
  'thermonuclear',
  'zuk',
  'inferno',
  'jad',
  'fightcaves',
  'vene',
  'venenatis',
  'vetion',
  'vork',
  'vorkath',
  'wt',
  'wintertodt',
  'zalc',
  'zalcano',
  'zulrah',
];
