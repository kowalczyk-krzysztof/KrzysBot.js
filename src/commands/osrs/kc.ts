import { Message } from 'discord.js';
import { BossAliases, Bosses } from '../../utils/osrs/enums';
import { OsrsEmbed, EmbedTitles, usernameString } from '../../utils/embed';
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
import { isOnCooldown } from '../../cache/cooldown';
import {
  isPrefixValid,
  Categories,
  invalidPrefixMsg,
} from '../../utils/osrs/isPrefixValid';
import { bossValidator } from '../../utils/osrs/bossValidator';

export const kc = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const indexes: number[] = [0, 1, 2];
  const bossValidation: {
    bossWordLength: number;
    boss: string;
  } = bossValidator(args, indexes);
  let user: string[];
  let boss: string;

  if (bossValidation.bossWordLength === 0)
    return msg.channel.send(
      invalidPrefixMsg(Categories.BOSS, bosses.join(', '))
    );
  else if (bossValidation.bossWordLength === 1) user = args.slice(1);
  else if (bossValidation.bossWordLength === 2) user = args.slice(2);
  else user = args.slice(3);

  const bossToArray: string[] = [bossValidation.boss];
  const finalCheck: string | null = isPrefixValid(
    msg,
    bossToArray,
    bosses,
    Categories.BOSS
  );
  if (finalCheck === null) return;
  else boss = finalCheck;

  const cooldown: number = 30;

  const nameCheck: string | null = runescapeNameValidator(user);
  if (nameCheck === null) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  if (isOnCooldown(msg, commandName, cooldown, false, args.join('')) === true)
    return;
  const embed: OsrsEmbed = new OsrsEmbed()
    .setTitle(EmbedTitles.KC)
    .addField(usernameString, `${username}`);
  if (username in osrsStats) {
    const result: OsrsEmbed = generateResult(boss, embed, osrsStats[username]);
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchOsrsStats(msg, username);
    if (isFetched === true) {
      const result: OsrsEmbed = generateResult(
        boss,
        embed,
        osrsStats[username]
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

export const bossTypeCheck = (
  prefix: string,
  playerObject: OsrsPlayer
): {
  bossKc: BossOrMinigame;
  bossName: string;
} => {
  const type: string = prefix;
  const playerStats: OsrsPlayer = playerObject;
  let bossKc: BossOrMinigame;
  let bossName: string;

  switch (type) {
    case BossAliases.SIRE_ALIAS1:
      bossKc = playerStats[Bosses.SIRE];
      bossName = Bosses.SIRE;
      break;
    case BossAliases.SIRE_ALIAS2:
      bossKc = playerStats[Bosses.SIRE];
      bossName = Bosses.SIRE;
      break;
    case BossAliases.HYDRA_ALIAS1:
      bossKc = playerStats[Bosses.HYDRA];
      bossName = Bosses.HYDRA;
      break;
    case BossAliases.HYDRA_ALIAS2:
      bossKc = playerStats[Bosses.HYDRA];
      bossName = Bosses.HYDRA;
      break;
    case BossAliases.BARROWS_ALIAS1:
      bossKc = playerStats[Bosses.BARROWS];
      bossName = Bosses.BARROWS;
      break;
    case BossAliases.BRYOPHYTA_ALIAS1:
      bossKc = playerStats[Bosses.BRYOPHYTA];
      bossName = Bosses.BRYOPHYTA;
      break;
    case BossAliases.BRYOPHYTA_ALIAS2:
      bossKc = playerStats[Bosses.BRYOPHYTA];
      bossName = Bosses.BRYOPHYTA;
      break;
    case BossAliases.CALLISTO_ALIAS1:
      bossKc = playerStats[Bosses.CALLISTO];
      bossName = Bosses.CALLISTO;
      break;
    case BossAliases.CERBERUS_ALIAS1:
      bossKc = playerStats[Bosses.CERBERUS];
      bossName = Bosses.CERBERUS;
      break;
    case BossAliases.CERBERUS_ALIAS2:
      bossKc = playerStats[Bosses.CERBERUS];
      bossName = Bosses.CERBERUS;
      break;
    case BossAliases.COX_ALIAS1:
      bossKc = playerStats[Bosses.COX];
      bossName = Bosses.COX;
      break;
    case BossAliases.COX_ALIAS2:
      bossKc = playerStats[Bosses.COX];
      bossName = Bosses.COX;
      break;
    case BossAliases.COX_ALIAS3:
      bossKc = playerStats[Bosses.COX];
      bossName = Bosses.COX;
      break;
    case BossAliases.COXCM_ALIAS1:
      bossKc = playerStats[Bosses.COXCM];
      bossName = Bosses.COXCM;
      break;
    case BossAliases.COXCM_ALIAS2:
      bossKc = playerStats[Bosses.COXCM];
      bossName = Bosses.COXCM;
      break;
    case BossAliases.COXCM_ALIAS3:
      bossKc = playerStats[Bosses.COXCM];
      bossName = Bosses.COXCM;
      break;
    case BossAliases.CHAOS_ELE_ALIAS1:
      bossKc = playerStats[Bosses.CHAOS_ELE];
      bossName = Bosses.CHAOS_ELE;
      break;
    case BossAliases.CHAOS_ELE_ALIAS2:
      bossKc = playerStats[Bosses.CHAOS_ELE];
      bossName = Bosses.CHAOS_ELE;
      break;
    case BossAliases.CHAOS_ELE_ALIAS3:
      bossKc = playerStats[Bosses.CHAOS_ELE];
      bossName = Bosses.CHAOS_ELE;
      break;
    case BossAliases.CHAOS_FANATIC_ALIAS1:
      bossKc = playerStats[Bosses.CHAOS_FANATIC];
      bossName = Bosses.CHAOS_FANATIC;
      break;
    case BossAliases.CHAOS_FANATIC_ALIAS2:
      bossKc = playerStats[Bosses.CHAOS_FANATIC];
      bossName = Bosses.CHAOS_FANATIC;
      break;
    case BossAliases.SARADOMIN_ALIAS1:
      bossKc = playerStats[Bosses.ZILYANA];
      bossName = Bosses.ZILYANA;
      break;
    case BossAliases.SARADOMIN_ALIAS2:
      bossKc = playerStats[Bosses.ZILYANA];
      bossName = Bosses.ZILYANA;
      break;
    case BossAliases.SARADOMIN_ALIAS3:
      bossKc = playerStats[Bosses.ZILYANA];
      bossName = Bosses.ZILYANA;
      break;
    case BossAliases.SARADOMIN_ALIAS4:
      bossKc = playerStats[Bosses.ZILYANA];
      bossName = Bosses.ZILYANA;
      break;
    case BossAliases.CORP_ALIAS1:
      bossKc = playerStats[Bosses.CORP];
      bossName = Bosses.CORP;
      break;
    case BossAliases.CORP_ALIAS2:
      bossKc = playerStats[Bosses.CORP];
      bossName = Bosses.CORP;
      break;
    case BossAliases.CRAZY_ARCH_ALIAS1:
      bossKc = playerStats[Bosses.CRAZY_ARCH];
      bossName = Bosses.CRAZY_ARCH;
      break;
    case BossAliases.CRAZY_ARCH_ALIAS2:
      bossKc = playerStats[Bosses.CRAZY_ARCH];
      bossName = Bosses.CRAZY_ARCH;
      break;
    case BossAliases.PRIME_ALIAS1:
      bossKc = playerStats[Bosses.PRIME];
      bossName = Bosses.PRIME;
      break;
    case BossAliases.PRIME_ALIAS2:
      bossKc = playerStats[Bosses.PRIME];
      bossName = Bosses.PRIME;
      break;
    case BossAliases.REX_ALIAS1:
      bossKc = playerStats[Bosses.REX];
      bossName = Bosses.REX;
      break;
    case BossAliases.REX_ALIAS2:
      bossKc = playerStats[Bosses.REX];
      bossName = Bosses.REX;
      break;
    case BossAliases.SUPREME_ALIAS1:
      bossKc = playerStats[Bosses.SUPREME];
      bossName = Bosses.SUPREME;
      break;
    case BossAliases.SUPREME_ALIAS2:
      bossKc = playerStats[Bosses.SUPREME];
      bossName = Bosses.SUPREME;
      break;
    case BossAliases.DERANGED_ALIAS1:
      bossKc = playerStats[Bosses.DER_ARCH];
      bossName = Bosses.DER_ARCH;
      break;
    case BossAliases.DERANGED_ALIAS2:
      bossKc = playerStats[Bosses.DER_ARCH];
      bossName = Bosses.DER_ARCH;
      break;
    case BossAliases.DERANGED_ALIAS3:
      bossKc = playerStats[Bosses.DER_ARCH];
      bossName = Bosses.DER_ARCH;
      break;
    case BossAliases.BANDOS_ALIAS1:
      bossKc = playerStats[Bosses.GRAARDOR];
      bossName = Bosses.GRAARDOR;
      break;
    case BossAliases.BANDOS_ALIAS2:
      bossKc = playerStats[Bosses.GRAARDOR];
      bossName = Bosses.GRAARDOR;
      break;
    case BossAliases.BANDOS_ALIAS3:
      bossKc = playerStats[Bosses.GRAARDOR];
      bossName = Bosses.GRAARDOR;
      break;
    case BossAliases.MOLE_ALIAS1:
      bossKc = playerStats[Bosses.MOLE];
      bossName = Bosses.MOLE;
      break;
    case BossAliases.MOLE_ALIAS2:
      bossKc = playerStats[Bosses.MOLE];
      bossName = Bosses.MOLE;
      break;
    case BossAliases.GUARDIANS_ALIAS1:
      bossKc = playerStats[Bosses.GUARDIANS];
      bossName = Bosses.GUARDIANS;
      break;
    case BossAliases.GUARDIANS_ALIAS2:
      bossKc = playerStats[Bosses.GUARDIANS];
      bossName = Bosses.GUARDIANS;
      break;
    case BossAliases.GUARDIANS_ALIAS3:
      bossKc = playerStats[Bosses.GUARDIANS];
      bossName = Bosses.GUARDIANS;
      break;
    case BossAliases.GUARDIANS_ALIAS4:
      bossKc = playerStats[Bosses.GUARDIANS];
      bossName = Bosses.GUARDIANS;
      break;
    case BossAliases.GUARDIANS_ALIAS5:
      bossKc = playerStats[Bosses.GUARDIANS];
      bossName = Bosses.GUARDIANS;
      break;
    case BossAliases.HESPORI_ALIAS1:
      bossKc = playerStats[Bosses.GUARDIANS];
      bossName = Bosses.GUARDIANS;
      break;
    case BossAliases.KQ_ALIAS1:
      bossKc = playerStats[Bosses.KQ];
      bossName = Bosses.KQ;
      break;
    case BossAliases.KQ_ALIAS2:
      bossKc = playerStats[Bosses.KQ];
      bossName = Bosses.KQ;
      break;
    case BossAliases.KQ_ALIAS3:
      bossKc = playerStats[Bosses.KQ];
      bossName = Bosses.KQ;
      break;
    case BossAliases.KBD_ALIAS1:
      bossKc = playerStats[Bosses.KBD];
      bossName = Bosses.KBD;
      break;
    case BossAliases.KBD_ALIAS2:
      bossKc = playerStats[Bosses.KBD];
      bossName = Bosses.KBD;
      break;
    case BossAliases.KRAKEN_ALIAS1:
      bossKc = playerStats[Bosses.KRAKEN];
      bossName = Bosses.KRAKEN;
      break;
    case BossAliases.ARMA_ALIAS1:
      bossKc = playerStats[Bosses.KREE];
      bossName = Bosses.KREE;
      break;
    case BossAliases.ARMA_ALIAS2:
      bossKc = playerStats[Bosses.KREE];
      bossName = Bosses.KREE;
      break;
    case BossAliases.ARMA_ALIAS3:
      bossKc = playerStats[Bosses.KREE];
      bossName = Bosses.KREE;
      break;
    case BossAliases.ARMA_ALIAS4:
      bossKc = playerStats[Bosses.KREE];
      bossName = Bosses.KREE;
      break;
    case BossAliases.ARMA_ALIAS5:
      bossKc = playerStats[Bosses.KREE];
      bossName = Bosses.KREE;
      break;
    case BossAliases.ZAMMY_ALIAS1:
      bossKc = playerStats[Bosses.KRIL];
      bossName = Bosses.KRIL;
      break;
    case BossAliases.ZAMMY_ALIAS2:
      bossKc = playerStats[Bosses.KRIL];
      bossName = Bosses.KRIL;
      break;
    case BossAliases.ZAMMY_ALIAS3:
      bossKc = playerStats[Bosses.KRIL];
      bossName = Bosses.KRIL;
      break;
    case BossAliases.ZAMMY_ALIAS4:
      bossKc = playerStats[Bosses.KRIL];
      bossName = Bosses.KRIL;
      break;
    case BossAliases.ZAMMY_ALIAS5:
      bossKc = playerStats[Bosses.KRIL];
      bossName = Bosses.KRIL;
      break;
    case BossAliases.MIMIC_ALIAS1:
      bossKc = playerStats[Bosses.MIMIC];
      bossName = Bosses.MIMIC;
      break;
    case BossAliases.NIGHTMARE_ALIAS1:
      bossKc = playerStats[Bosses.NIGHTMARE];
      bossName = Bosses.NIGHTMARE;
      break;
    case BossAliases.OBOR_ALIAS1:
      bossKc = playerStats[Bosses.OBOR];
      bossName = Bosses.OBOR;
      break;
    case BossAliases.SARACHNIS_ALIAS1:
      bossKc = playerStats[Bosses.SARACHNIS];
      bossName = Bosses.SARACHNIS;
      break;
    case BossAliases.SCORPIA_ALIAS1:
      bossKc = playerStats[Bosses.SCORPIA];
      bossName = Bosses.SCORPIA;
      break;
    case BossAliases.SKOTIZO_ALIAS1:
      bossKc = playerStats[Bosses.SKOTIZO];
      bossName = Bosses.SKOTIZO;
      break;
    case BossAliases.TEMPOROSS_ALIAS1:
      bossKc = playerStats[Bosses.TEMPO];
      bossName = Bosses.TEMPO;
      break;
    case BossAliases.TEMPOROSS_ALIAS2:
      bossKc = playerStats[Bosses.TEMPO];
      bossName = Bosses.TEMPO;
      break;
    case BossAliases.GAUNTLET_ALIAS1:
      bossKc = playerStats[Bosses.GAUNTLET];
      bossName = Bosses.GAUNTLET;
      break;
    case BossAliases.GAUNTLET_ALIAS2:
      bossKc = playerStats[Bosses.GAUNTLET];
      bossName = Bosses.GAUNTLET;
      break;
    case BossAliases.CORR_GAUNTLET_ALIAS1:
      bossKc = playerStats[Bosses.CORR_GAUNTLET];
      bossName = Bosses.CORR_GAUNTLET;
      break;
    case BossAliases.CORR_GAUNTLET_ALIAS2:
      bossKc = playerStats[Bosses.CORR_GAUNTLET];
      bossName = Bosses.CORR_GAUNTLET;
      break;
    case BossAliases.CORR_GAUNTLET_ALIAS3:
      bossKc = playerStats[Bosses.CORR_GAUNTLET];
      bossName = Bosses.CORR_GAUNTLET;
      break;
    case BossAliases.CORR_GAUNTLET_ALIAS4:
      bossKc = playerStats[Bosses.CORR_GAUNTLET];
      bossName = Bosses.CORR_GAUNTLET;
      break;
    case BossAliases.CORR_GAUNTLET_ALIAS5:
      bossKc = playerStats[Bosses.CORR_GAUNTLET];
      bossName = Bosses.CORR_GAUNTLET;
      break;
    case BossAliases.TOB_ALIAS1:
      bossKc = playerStats[Bosses.TOB];
      bossName = Bosses.TOB;
      break;
    case BossAliases.TOB_ALIAS2:
      bossKc = playerStats[Bosses.TOB];
      bossName = Bosses.TOB;
      break;
    case BossAliases.TOB_ALIAS3:
      bossKc = playerStats[Bosses.TOB];
      bossName = Bosses.TOB;
      break;
    case BossAliases.THERMY_ALIAS1:
      bossKc = playerStats[Bosses.THERMY];
      bossName = Bosses.THERMY;
      break;
    case BossAliases.THERMY_ALIAS2:
      bossKc = playerStats[Bosses.THERMY];
      bossName = Bosses.THERMY;
      break;
    case BossAliases.THERMY_ALIAS3:
      bossKc = playerStats[Bosses.THERMY];
      bossName = Bosses.THERMY;
      break;
    case BossAliases.ZUK_ALIAS1:
      bossKc = playerStats[Bosses.ZUK];
      bossName = Bosses.ZUK;
      break;
    case BossAliases.ZUK_ALIAS2:
      bossKc = playerStats[Bosses.ZUK];
      bossName = Bosses.ZUK;
      break;
    case BossAliases.JAD_ALIAS1:
      bossKc = playerStats[Bosses.JAD];
      bossName = Bosses.JAD;
      break;
    case BossAliases.JAD_ALIAS2:
      bossKc = playerStats[Bosses.JAD];
      bossName = Bosses.JAD;
      break;
    case BossAliases.VENE_ALIAS1:
      bossKc = playerStats[Bosses.VENE];
      bossName = Bosses.VENE;
      break;
    case BossAliases.VENE_ALIAS2:
      bossKc = playerStats[Bosses.VENE];
      bossName = Bosses.VENE;
      break;
    case BossAliases.VETION_ALIAS1:
      bossKc = playerStats[Bosses.VETION];
      bossName = Bosses.VETION;
      break;
    case BossAliases.VORK_ALIAS1:
      bossKc = playerStats[Bosses.VORKATH];
      bossName = Bosses.VORKATH;
      break;
    case BossAliases.VORK_ALIAS2:
      bossKc = playerStats[Bosses.VORKATH];
      bossName = Bosses.VORKATH;
      break;
    case BossAliases.WT_ALIAS1:
      bossKc = playerStats[Bosses.WT];
      bossName = Bosses.WT;
      break;
    case BossAliases.WT_ALIAS2:
      bossKc = playerStats[Bosses.WT];
      bossName = Bosses.WT;
      break;
    case BossAliases.ZALC_ALIAS1:
      bossKc = playerStats[Bosses.ZALCANO];
      bossName = Bosses.ZALCANO;
      break;
    case BossAliases.ZALC_ALIAS2:
      bossKc = playerStats[Bosses.ZALCANO];
      bossName = Bosses.ZALCANO;
      break;
    case BossAliases.ZULRAH_ALIAS1:
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

export const bosses: string[] = [
  BossAliases.SIRE_ALIAS1,
  BossAliases.SIRE_ALIAS1,
  BossAliases.SIRE_ALIAS2,
  BossAliases.HYDRA_ALIAS1,
  BossAliases.HYDRA_ALIAS2,
  BossAliases.BARROWS_ALIAS1,
  BossAliases.BRYOPHYTA_ALIAS1,
  BossAliases.BRYOPHYTA_ALIAS2,
  BossAliases.CALLISTO_ALIAS1,
  BossAliases.CERBERUS_ALIAS1,
  BossAliases.CERBERUS_ALIAS2,
  BossAliases.COX_ALIAS1,
  BossAliases.COX_ALIAS2,
  BossAliases.COX_ALIAS3,
  BossAliases.COXCM_ALIAS1,
  BossAliases.COXCM_ALIAS2,
  BossAliases.COXCM_ALIAS3,
  BossAliases.CHAOS_ELE_ALIAS1,
  BossAliases.CHAOS_ELE_ALIAS2,
  BossAliases.CHAOS_ELE_ALIAS3,
  BossAliases.CHAOS_FANATIC_ALIAS1,
  BossAliases.CHAOS_FANATIC_ALIAS2,
  BossAliases.SARADOMIN_ALIAS1,
  BossAliases.SARADOMIN_ALIAS2,
  BossAliases.SARADOMIN_ALIAS3,
  BossAliases.SARADOMIN_ALIAS4,
  BossAliases.CORP_ALIAS1,
  BossAliases.CORP_ALIAS2,
  BossAliases.CRAZY_ARCH_ALIAS1,
  BossAliases.CRAZY_ARCH_ALIAS2,
  BossAliases.PRIME_ALIAS1,
  BossAliases.PRIME_ALIAS2,
  BossAliases.REX_ALIAS1,
  BossAliases.REX_ALIAS2,
  BossAliases.SUPREME_ALIAS1,
  BossAliases.SUPREME_ALIAS2,
  BossAliases.DERANGED_ALIAS1,
  BossAliases.DERANGED_ALIAS2,
  BossAliases.DERANGED_ALIAS3,
  BossAliases.BANDOS_ALIAS1,
  BossAliases.BANDOS_ALIAS2,
  BossAliases.BANDOS_ALIAS3,
  BossAliases.MOLE_ALIAS1,
  BossAliases.MOLE_ALIAS2,
  BossAliases.GUARDIANS_ALIAS1,
  BossAliases.GUARDIANS_ALIAS2,
  BossAliases.GUARDIANS_ALIAS3,
  BossAliases.GUARDIANS_ALIAS4,
  BossAliases.GUARDIANS_ALIAS5,
  BossAliases.HESPORI_ALIAS1,
  BossAliases.KQ_ALIAS1,
  BossAliases.KQ_ALIAS2,
  BossAliases.KQ_ALIAS3,
  BossAliases.KBD_ALIAS1,
  BossAliases.KBD_ALIAS2,
  BossAliases.KRAKEN_ALIAS1,
  BossAliases.ARMA_ALIAS1,
  BossAliases.ARMA_ALIAS2,
  BossAliases.ARMA_ALIAS3,
  BossAliases.ARMA_ALIAS4,
  BossAliases.ARMA_ALIAS5,
  BossAliases.ZAMMY_ALIAS1,
  BossAliases.ZAMMY_ALIAS2,
  BossAliases.ZAMMY_ALIAS3,
  BossAliases.ZAMMY_ALIAS4,
  BossAliases.ZAMMY_ALIAS5,
  BossAliases.MIMIC_ALIAS1,
  BossAliases.NIGHTMARE_ALIAS1,
  BossAliases.OBOR_ALIAS1,
  BossAliases.SARACHNIS_ALIAS1,
  BossAliases.SCORPIA_ALIAS1,
  BossAliases.SKOTIZO_ALIAS1,
  BossAliases.GAUNTLET_ALIAS1,
  BossAliases.GAUNTLET_ALIAS2,
  BossAliases.CORR_GAUNTLET_ALIAS1,
  BossAliases.CORR_GAUNTLET_ALIAS2,
  BossAliases.CORR_GAUNTLET_ALIAS3,
  BossAliases.CORR_GAUNTLET_ALIAS4,
  BossAliases.CORR_GAUNTLET_ALIAS5,
  BossAliases.TOB_ALIAS1,
  BossAliases.TOB_ALIAS2,
  BossAliases.TOB_ALIAS3,
  BossAliases.THERMY_ALIAS1,
  BossAliases.THERMY_ALIAS2,
  BossAliases.THERMY_ALIAS3,
  BossAliases.ZUK_ALIAS1,
  BossAliases.ZUK_ALIAS2,
  BossAliases.JAD_ALIAS1,
  BossAliases.JAD_ALIAS2,
  BossAliases.VENE_ALIAS1,
  BossAliases.VENE_ALIAS2,
  BossAliases.VETION_ALIAS1,
  BossAliases.VORK_ALIAS1,
  BossAliases.VORK_ALIAS2,
  BossAliases.WT_ALIAS1,
  BossAliases.WT_ALIAS2,
  BossAliases.ZALC_ALIAS1,
  BossAliases.ZALC_ALIAS2,
  BossAliases.ZULRAH_ALIAS1,
];
