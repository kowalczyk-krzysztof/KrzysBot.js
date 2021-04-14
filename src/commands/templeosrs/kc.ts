import { Message } from 'discord.js';
import { playerStats, fetchTemple, PlayerStats } from '../../cache/templeCache';
import { TempleEmbed } from '../../utils/embed';
import { templeDateParser } from '../../utils/osrs/templeDateParser';
import { runescapeNameValidator } from '../../utils/osrs/runescapeNameValidator';
import { argsWithPrefixToString } from '../../utils/argsToString';
import { isPrefixValid } from '../../utils/osrs/isPrefixValid';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

const bosses: string[] = [
  'sire',
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
  'deranged_arch',
  'graardor',
  'bandos',
  'mole',
  'guardians',
  'gg',
  'grotesque',
  'hespori',
  'kq',
  'kalphite',
  'kbd',
  'kraken',
  'kree',
  'arma',
  'armadyl',
  'kril',
  'zammy',
  'zamorak',
  'kril_tsutsaroth',
  'mimic',
  'nightmare',
  'obor',
  'sarachnis',
  'scropia',
  'skotizo',
  'gauntlet',
  'hunllef',
  'corr_gauntlet',
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

export const kc = async (
  msg: Message,
  ...args: string[]
): Promise<Message | undefined> => {
  const prefix: string | null = isPrefixValid(msg, args, bosses, 'boss');
  if (prefix === null) return;
  const usernameWithoutSpaces: string = args.slice(1).join('');
  const nameCheck: boolean = runescapeNameValidator(usernameWithoutSpaces);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const usernameWithSpaces: string = argsWithPrefixToString(...args);
  const embed: TempleEmbed = new TempleEmbed()
    .setTitle('Bosses')
    .addField('Username', `${usernameWithSpaces}`);
  if (usernameWithSpaces in playerStats) {
    const result = generateEmbed(
      prefix,
      embed,
      playerStats[usernameWithSpaces]
    );
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchTemple(msg, usernameWithSpaces);
    if (isFetched === true) {
      const result = generateEmbed(
        prefix,
        embed,
        playerStats[usernameWithSpaces]
      );
      return msg.channel.send(result);
    } else return;
  }
};

// Generates embed sent to user
const generateEmbed = (
  inputPrefix: string,
  inputEmbed: TempleEmbed,
  playerObject: PlayerStats
): TempleEmbed => {
  const prefix: string = inputPrefix;
  const embed: TempleEmbed = inputEmbed;
  const player: PlayerStats = playerObject;
  const lastChecked: { title: string; time: string } = templeDateParser(
    player.info['Last checked']
  );
  embed.addField(`${lastChecked.title}`, `${lastChecked.time}`);
  const bossName: number = bossTypeCheck(prefix, player);
  const formattedPrefix: string = capitalizeFirstLetter(prefix);
  embed.addField(`${formattedPrefix} kills`, `${bossName}`);
  return embed;
};

const bossTypeCheck = (prefix: string, playerObject: PlayerStats): number => {
  const type: string = prefix;
  const playerStats = playerObject;
  let bossesKilled: number;

  switch (type) {
    case 'sire':
      bossesKilled = playerStats[Bosses.SIRE];
      break;
    case 'hydra':
      bossesKilled = playerStats[Bosses.HYDRA];
      break;
    case 'barrows':
      bossesKilled = playerStats[Bosses.BARROWS];
      break;
    case 'bryo':
      bossesKilled = playerStats[Bosses.BRYOPHYTA];
      break;
    case 'bryophyta':
      bossesKilled = playerStats[Bosses.BRYOPHYTA];
      break;
    case 'callisto':
      bossesKilled = playerStats[Bosses.CALLISTO];
      break;
    case 'cerberus':
      bossesKilled = playerStats[Bosses.CERBERUS];
      break;
    case 'cerb':
      bossesKilled = playerStats[Bosses.CERBERUS];
      break;
    case 'cox':
      bossesKilled = playerStats[Bosses.COX];
      break;
    case 'chambers':
      bossesKilled = playerStats[Bosses.COX];
      break;
    case 'cm':
      bossesKilled = playerStats[Bosses.COXCM];
      break;
    case 'coxcm':
      bossesKilled = playerStats[Bosses.COXCM];
      break;
    case 'ele':
      bossesKilled = playerStats[Bosses.CHAOS_ELE];
      break;
    case 'chaos_ele':
      bossesKilled = playerStats[Bosses.CHAOS_ELE];
      break;
    case 'fanatic':
      bossesKilled = playerStats[Bosses.CHAOS_FANATIC];
      break;
    case 'chaos_fanatic':
      bossesKilled = playerStats[Bosses.CHAOS_FANATIC];
      break;
    case 'sara':
      bossesKilled = playerStats[Bosses.ZILYANA];
      break;
    case 'saradomin':
      bossesKilled = playerStats[Bosses.ZILYANA];
      break;
    case 'zilyana':
      bossesKilled = playerStats[Bosses.ZILYANA];
      break;
    case 'zilly':
      bossesKilled = playerStats[Bosses.ZILYANA];
      break;
    case 'corp':
      bossesKilled = playerStats[Bosses.CORP];
      break;
    case 'crazy_arch':
      bossesKilled = playerStats[Bosses.CRAZY_ARCH];
      break;
    case 'prime':
      bossesKilled = playerStats[Bosses.PRIME];
      break;
    case 'dagannoth_prime':
      bossesKilled = playerStats[Bosses.PRIME];
      break;
    case 'rex':
      bossesKilled = playerStats[Bosses.REX];
      break;
    case 'dagannoth_rex':
      bossesKilled = playerStats[Bosses.REX];
      break;
    case 'supreme':
      bossesKilled = playerStats[Bosses.SUPREME];
      break;
    case 'dagannoth_supreme':
      bossesKilled = playerStats[Bosses.SUPREME];
      break;
    case 'deranged_arch':
      bossesKilled = playerStats[Bosses.DER_ARCH];
      break;
    case 'graardor':
      bossesKilled = playerStats[Bosses.GRAARDOR];
      break;
    case 'bandos':
      bossesKilled = playerStats[Bosses.GRAARDOR];
      break;
    case 'mole':
      bossesKilled = playerStats[Bosses.MOLE];
      break;
    case 'guardians':
      bossesKilled = playerStats[Bosses.GUARDIANS];
      break;
    case 'gg':
      bossesKilled = playerStats[Bosses.GUARDIANS];
      break;
    case 'grotesque':
      bossesKilled = playerStats[Bosses.GUARDIANS];
      break;
    case 'hespori':
      bossesKilled = playerStats[Bosses.GUARDIANS];
      break;
    case 'kq':
      bossesKilled = playerStats[Bosses.KQ];
      break;
    case 'kalphite':
      bossesKilled = playerStats[Bosses.KQ];
      break;
    case 'kbd':
      bossesKilled = playerStats[Bosses.KBD];
      break;
    case 'kraken':
      bossesKilled = playerStats[Bosses.KRAKEN];
      break;
    case 'kree':
      bossesKilled = playerStats[Bosses.KREE];
      break;
    case 'arma':
      bossesKilled = playerStats[Bosses.KREE];
      break;
    case 'armadyl':
      bossesKilled = playerStats[Bosses.KREE];
      break;
    case 'kril':
      bossesKilled = playerStats[Bosses.KRIL];
      break;
    case 'zammy':
      bossesKilled = playerStats[Bosses.KRIL];
      break;
    case 'zamorak':
      bossesKilled = playerStats[Bosses.KRIL];
      break;
    case 'kril_tsutsaroth':
      bossesKilled = playerStats[Bosses.KRIL];
      break;
    case 'mimic':
      bossesKilled = playerStats[Bosses.MIMIC];
      break;
    case 'nightmare':
      bossesKilled = playerStats[Bosses.NIGHTMARE];
      break;
    case 'obor':
      bossesKilled = playerStats[Bosses.OBOR];
      break;
    case 'sarachnis':
      bossesKilled = playerStats[Bosses.SARACHNIS];
      break;
    case 'scropia':
      bossesKilled = playerStats[Bosses.SCROPIA];
      break;
    case 'skotizo':
      bossesKilled = playerStats[Bosses.SKOTIZO];
      break;
    case 'gauntlet':
      bossesKilled = playerStats[Bosses.GAUNTLET];
      break;
    case 'hunllef':
      bossesKilled = playerStats[Bosses.GAUNTLET];
      break;
    case 'corr_gauntlet':
      bossesKilled = playerStats[Bosses.CORR_GAUNTLET];
      break;
    case 'corr':
      bossesKilled = playerStats[Bosses.CORR_GAUNTLET];
      break;
    case 'corrupted':
      bossesKilled = playerStats[Bosses.CORR_GAUNTLET];
      break;
    case 'corr_hunllef':
      bossesKilled = playerStats[Bosses.CORR_GAUNTLET];
      break;
    case 'tob':
      bossesKilled = playerStats[Bosses.TOB];
      break;
    case 'theatre':
      bossesKilled = playerStats[Bosses.TOB];
      break;
    case 'thermy':
      bossesKilled = playerStats[Bosses.THERMY];
      break;
    case 'thermonuclear':
      bossesKilled = playerStats[Bosses.THERMY];
      break;
    case 'zuk':
      bossesKilled = playerStats[Bosses.ZUK];
      break;
    case 'inferno':
      bossesKilled = playerStats[Bosses.ZUK];
      break;
    case 'jad':
      bossesKilled = playerStats[Bosses.JAD];
      break;
    case 'fight_caves':
      bossesKilled = playerStats[Bosses.JAD];
      break;
    case 'venenatis':
      bossesKilled = playerStats[Bosses.VENE];
      break;
    case 'vene':
      bossesKilled = playerStats[Bosses.VENE];
      break;
    case 'vetion':
      bossesKilled = playerStats[Bosses.VETION];
      break;
    case 'vork':
      bossesKilled = playerStats[Bosses.VORKATH];
      break;
    case 'vorkath':
      bossesKilled = playerStats[Bosses.VORKATH];
      break;
    case 'wt':
      bossesKilled = playerStats[Bosses.WT];
      break;
    case 'wintertodt':
      bossesKilled = playerStats[Bosses.WT];
      break;
    case 'zalc':
      bossesKilled = playerStats[Bosses.ZALCANO];
      break;
    case 'zalcano':
      bossesKilled = playerStats[Bosses.ZALCANO];
      break;
    case 'zulrah':
      bossesKilled = playerStats[Bosses.ZULRAH];
      break;
    default:
      bossesKilled = 0;
  }
  return bossesKilled;
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
  SCROPIA = 'Scorpia',
  SKOTIZO = 'Skotizo',
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
