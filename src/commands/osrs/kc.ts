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
import { isPrefixValid, Categories } from '../../utils/osrs/isPrefixValid';
import { isOnCooldown } from '../../cache/cooldown';
export const kc = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const prefix: string | null = isPrefixValid(
    msg,
    args,
    bosses,
    Categories.BOSS
  );
  if (prefix === null) return;
  const cooldown: number = 30;
  if (isOnCooldown(msg, commandName, cooldown, false, args) === true) return;
  const usernameWithoutSpaces: string[] = args.slice(1);
  const nameCheck: boolean = runescapeNameValidator(usernameWithoutSpaces);
  if (nameCheck === false) return msg.channel.send(invalidUsername);
  const usernameWithSpaces: string = argumentParser(args, 1, ParserTypes.OSRS);
  const embed: OsrsEmbed = new OsrsEmbed()
    .setTitle(OsrsEmbedTitles.KC)
    .addField(usernameString, `${usernameWithSpaces}`);
  if (usernameWithSpaces in osrsStats) {
    const result = generateResult(prefix, embed, osrsStats[usernameWithSpaces]);
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchOsrsStats(msg, usernameWithSpaces);
    if (isFetched === true) {
      const result = generateResult(
        prefix,
        embed,
        osrsStats[usernameWithSpaces]
      );
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
    case 'abyssal_sire':
      bossKc = playerStats[Bosses.SIRE];
      bossName = Bosses.SIRE;
      break;
    case 'sire':
      bossKc = playerStats[Bosses.SIRE];
      bossName = Bosses.SIRE;
      break;
    case 'alchemical_hydra':
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
    case 'ele':
      bossKc = playerStats[Bosses.CHAOS_ELE];
      bossName = Bosses.CHAOS_ELE;
      break;
    case 'chaos_ele':
      bossKc = playerStats[Bosses.CHAOS_ELE];
      bossName = Bosses.CHAOS_ELE;
      break;
    case 'chaos_elemental':
      bossKc = playerStats[Bosses.CHAOS_ELE];
      bossName = Bosses.CHAOS_ELE;
      break;
    case 'fanatic':
      bossKc = playerStats[Bosses.CHAOS_FANATIC];
      bossName = Bosses.CHAOS_FANATIC;
      break;
    case 'chaos_fanatic':
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
    case 'crazy_arch':
      bossKc = playerStats[Bosses.CRAZY_ARCH];
      bossName = Bosses.CRAZY_ARCH;
      break;
    case 'prime':
      bossKc = playerStats[Bosses.PRIME];
      bossName = Bosses.PRIME;
      break;
    case 'dagannoth_prime':
      bossKc = playerStats[Bosses.PRIME];
      bossName = Bosses.PRIME;
      break;
    case 'rex':
      bossKc = playerStats[Bosses.REX];
      bossName = Bosses.REX;
      break;
    case 'dagannoth_rex':
      bossKc = playerStats[Bosses.REX];
      bossName = Bosses.REX;
      break;
    case 'supreme':
      bossKc = playerStats[Bosses.SUPREME];
      bossName = Bosses.SUPREME;
      break;
    case 'dagannoth_supreme':
      bossKc = playerStats[Bosses.SUPREME];
      bossName = Bosses.SUPREME;
      break;
    case 'deranged_arch':
      bossKc = playerStats[Bosses.DER_ARCH];
      bossName = Bosses.DER_ARCH;
      break;
    case 'deranged_archeologist':
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
    case 'kril_tsutsaroth':
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
    case 'corr_gauntlet':
      bossKc = playerStats[Bosses.CORR_GAUNTLET];
      bossName = Bosses.CORR_GAUNTLET;
      break;
    case 'corrupted_gauntlet':
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
    case 'corr_hunllef':
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
    case 'fight_caves':
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
  'abyssal_sire',
  'sire',
  'alchemical_hydra',
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
  'chaos_ele',
  'chaos_elemental',
  'fanatic',
  'chaos_fanatic',
  'sara',
  'saradomin',
  'zilyana',
  'zilly',
  'corp',
  'crazy_arch',
  'prime',
  'dagannoth_prime',
  'rex',
  'dagannoth_rex',
  'supreme',
  'dagannoth_supreme',
  'deranged_archeologist',
  'deranged_arch',
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
  'kril_tsutsaroth',
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
  'corr_gauntlet',
  'corrupted_gauntlet',
  'corr',
  'corrupted',
  'corr_hunllef',
  'tob',
  'theatre',
  'thermy',
  'thermonuclear',
  'zuk',
  'inferno',
  'jad',
  'fight_caves',
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
