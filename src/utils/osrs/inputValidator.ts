// Discord
import { Message } from 'discord.js';
// UTILS: Embeds
import { Embed } from '../embed';
// UTILS: Enums
import {
  BossAliases,
  Bosses,
  ClueAliases,
  Clues,
  SkillAliases,
  Skills,
  TempleOther,
  TempleOverviewTimeAliases,
  ValidInputCases,
  BossCases,
  OsrsCommands,
} from './enums';
// UTILS: Prefix validator
import { PrefixCategories, invalidPrefixMsg } from './isPrefixValid';
// UTILS: Boss validator
import { bossValidator } from './bossValidator';

export const validInputCases: string[] = [
  ValidInputCases.CLUES,
  ValidInputCases.BOSS,
  ValidInputCases.SKILL,
  ValidInputCases.OTHER,
];
const timeTypes = [
  TempleOther.SIX_HOURS,
  TempleOther.DAY,
  TempleOther.WEEK,
  TempleOther.MONTH,
  TempleOther.YEAR,
];

const otherTypes = [
  TempleOther.LMS_LOWERCASE,
  TempleOther.EHB_LOWERCASE,
  TempleOther.EHP_LOWERCASE,
];
export const templeOverviewTimeAliases: string[] = [
  TempleOverviewTimeAliases.FIVEMIN,
  TempleOverviewTimeAliases.DAY,
  TempleOverviewTimeAliases.WEEK,
  TempleOverviewTimeAliases.MONTH,
  TempleOverviewTimeAliases.HALFYEAR,
  TempleOverviewTimeAliases.YEAR,
  TempleOverviewTimeAliases.ALLTIME,
];

enum FirstArgumentType {
  FAILED = 0,
  CLUES = 1,
  OTHER = 2,
  SKILL = 3,
  BOSS_ONE_WORD = 4,
  BOSS_TWO_WORD = 5,
  BOSS_THREE_WORD = 6,
}
/*
First check which command was used (commandName) and change arrays accordingly

Check if args is empty. Then check first argument if it's "clues", "other", "bosses", "skills". Then do checks based on what the previous argument was. For bosses do additional checks depending on length of boss words. Then check next argument (time) - if it's valid then whatever is left is the username. Return an object

{
  rsn: string[] | undefined;
  time: string | undefined;
  field: string | undefined;
  case: string | undefined;
} 
*/
export const templeGainsRecords = (
  msg: Message,
  args: string[],
  commandName: string
):
  | {
      rsn: string[] | undefined;
      time: string | undefined;
      field: string | undefined;
      case: string | undefined;
    }
  | undefined => {
  let validFirstArgument: string | undefined;
  // Lowercase everything first
  const lowerCasedArguments = args.map((e: string) => {
    return e.toLowerCase();
  });
  let conditionalTypeOther: string[];
  // Change the command name in erorr msg based on commandName

  let usedCommand: string;
  // Change valid other case arguments based on command used
  if (commandName === OsrsCommands.GAINS) {
    conditionalTypeOther = [...otherTypes, TempleOther.IM_EHP_JOINED];
    usedCommand = OsrsCommands.GAINS;
  } else {
    conditionalTypeOther = otherTypes;
    usedCommand = OsrsCommands.RECORD;
  }
  if (args.length === 0) {
    msg.channel.send(
      new Embed().setDescription(
        `**Please provide arguments. Valid formats**:\`\`\`.${usedCommand} clues tier time username\n\n.${usedCommand} lms time username\n\n.${usedCommand} skill skill-name time username\n\n.${usedCommand} boss boss-name time username\`\`\``
      )
    );
    return;
  }
  // Check if the first argument is valid case (e.g boss)
  if (!validInputCases.includes(lowerCasedArguments[0])) {
    msg.channel.send(invalidPrefixMsg(validInputCases));
    return;
  } else {
    validFirstArgument = lowerCasedArguments[0];
  }
  let inputFieldName: string;
  let isFirstArgumentValid: boolean;
  let firstArgumentType: number;
  // Check if second argument is valid for relevant first argument e.g check if ".clues test" is valid
  switch (validFirstArgument) {
    case ValidInputCases.CLUES:
      if (!clueList.includes(lowerCasedArguments[1])) {
        msg.channel.send(invalidPrefixMsg(clueList, PrefixCategories.CLUES));
        return;
      } else {
        isFirstArgumentValid = true;
        firstArgumentType = FirstArgumentType.CLUES;
        inputFieldName = lowerCasedArguments[1];
      }
      break;
    case ValidInputCases.OTHER:
      if (!conditionalTypeOther.includes(lowerCasedArguments[1])) {
        msg.channel.send(
          invalidPrefixMsg(conditionalTypeOther, PrefixCategories.OTHER)
        );
        return;
      } else {
        isFirstArgumentValid = true;
        firstArgumentType = FirstArgumentType.OTHER;
        inputFieldName = lowerCasedArguments[1];
      }
      break;
    case ValidInputCases.SKILL:
      if (!skillList.includes(lowerCasedArguments[1])) {
        msg.channel.send(invalidPrefixMsg(skillList, PrefixCategories.SKILL));
        return;
      } else {
        isFirstArgumentValid = true;
        firstArgumentType = FirstArgumentType.SKILL;
        inputFieldName = lowerCasedArguments[1];
      }
      break;
    // For bosses perform boss validation using bossValidator
    case ValidInputCases.BOSS:
      const indexes: number[] = [1, 2, 3];
      const bossValidation:
        | {
            bossCase: number | undefined;
            boss: string | undefined;
          }
        | undefined = bossValidator(msg, lowerCasedArguments, indexes);
      if (bossValidation === undefined) return;
      else if (bossValidation.bossCase === BossCases.ONE_WORD) {
        isFirstArgumentValid = true;
        firstArgumentType = FirstArgumentType.BOSS_ONE_WORD;
      } else if (bossValidation.bossCase === BossCases.TWO_WORD) {
        isFirstArgumentValid = true;
        firstArgumentType = FirstArgumentType.BOSS_TWO_WORD;
      } else if (bossValidation.bossCase === BossCases.THREE_WORDS) {
        isFirstArgumentValid = true;
        firstArgumentType = FirstArgumentType.BOSS_THREE_WORD;
      } else {
        isFirstArgumentValid = true;
        firstArgumentType = FirstArgumentType.BOSS_ONE_WORD;
      }
      inputFieldName = bossValidation.boss as string;
      break;
    default: {
      return;
    }
  }

  let time: string | undefined;
  let rsn: string[] | undefined;

  let times: string[];
  // Change available times based on command used
  if (usedCommand === OsrsCommands.GAINS) times = templeOverviewTimeAliases;
  else times = timeTypes;

  if (isFirstArgumentValid === true) {
    // Check if input time is valid depending on first argument type. Slice everything before and including time. Whatever is left is username
    switch (firstArgumentType) {
      case FirstArgumentType.OTHER:
        if (!times.includes(lowerCasedArguments[2])) {
          msg.channel.send(
            invalidPrefixMsg(times, PrefixCategories.TIME_OTHER)
          );
          return;
        } else {
          rsn = lowerCasedArguments.slice(3);
          time = lowerCasedArguments[2];
          times;
        }
        break;
      case FirstArgumentType.CLUES:
        if (!times.includes(lowerCasedArguments[2])) {
          msg.channel.send(invalidPrefixMsg(times));
          return;
        } else {
          rsn = lowerCasedArguments.slice(3);
          time = lowerCasedArguments[2];
        }
        break;
      case FirstArgumentType.SKILL:
        if (!times.includes(lowerCasedArguments[2])) {
          msg.channel.send(invalidPrefixMsg(times));
          return;
        } else {
          rsn = lowerCasedArguments.slice(3);
          time = lowerCasedArguments[2];
        }
        break;
      case FirstArgumentType.BOSS_ONE_WORD:
        if (!times.includes(lowerCasedArguments[2])) {
          msg.channel.send(invalidPrefixMsg(times));
          return;
        } else {
          rsn = lowerCasedArguments.slice(3);
          time = lowerCasedArguments[2];
        }
        break;
      case FirstArgumentType.BOSS_TWO_WORD:
        if (!times.includes(lowerCasedArguments[3])) {
          msg.channel.send(invalidPrefixMsg(times));
          return;
        } else {
          rsn = lowerCasedArguments.slice(4);
          time = lowerCasedArguments[3];
        }
        break;
      case FirstArgumentType.BOSS_THREE_WORD:
        if (!times.includes(lowerCasedArguments[4])) {
          msg.channel.send(invalidPrefixMsg(times));
          return;
        } else {
          rsn = lowerCasedArguments.slice(5);
          time = lowerCasedArguments[4];
        }
        break;

      default:
        return;
    }
  }

  return {
    rsn,
    time,
    field: inputFieldName,
    case: validFirstArgument,
  };
};
// Take in a lowecase joined field e.g "theatreofblood". Check what case is fieldName and then perform relevant switch statement and try to match the finput field with actual key name eg. "Theatre Of Blood"
export const fieldNameCheck = (
  fieldName: string,
  checkCase: string
): string | undefined => {
  let fieldToCheck: string | undefined;
  if (checkCase === ValidInputCases.BOSS) fieldToCheck = bossFields(fieldName);
  else if (checkCase === ValidInputCases.SKILL)
    fieldToCheck = skillFields(fieldName);
  else if (checkCase === ValidInputCases.CLUES)
    fieldToCheck = clueFields(fieldName);
  else if (checkCase === ValidInputCases.OTHER)
    fieldToCheck = otherFields(fieldName);
  return fieldToCheck;
};

export const otherFields = (fieldName: string): string | undefined => {
  let fieldToCheck: string;
  switch (fieldName) {
    case TempleOther.EHB_LOWERCASE:
      fieldToCheck = TempleOther.EHB;
      break;
    case TempleOther.EHP_LOWERCASE:
      fieldToCheck = TempleOther.EHP;
      break;
    case TempleOther.LMS_LOWERCASE:
      fieldToCheck = TempleOther.LMS;
      break;
    case TempleOther.IM_EHP_JOINED:
      fieldToCheck = TempleOther.IM_EHP;
      break;
    default:
      return;
  }
  return fieldToCheck;
};

export const clueFields = (fieldName: string): string | undefined => {
  let fieldToCheck: string;
  switch (fieldName) {
    case ClueAliases.ALL:
      fieldToCheck = Clues.ALL;
      break;
    case ClueAliases.BEGINNER:
      fieldToCheck = Clues.BEGINNER;
      break;
    case ClueAliases.EASY:
      fieldToCheck = Clues.EASY;
      break;
    case ClueAliases.MEDIUM:
      fieldToCheck = Clues.MEDIUM;
      break;
    case ClueAliases.HARD:
      fieldToCheck = Clues.HARD;
      break;
    case ClueAliases.ELITE:
      fieldToCheck = Clues.ELITE;
      break;
    case ClueAliases.MASTER:
      fieldToCheck = Clues.MASTER;
      break;
    default:
      return;
  }
  return fieldToCheck;
};

export const skillFields = (fieldName: string): string | undefined => {
  let fieldToCheck: string;
  switch (fieldName) {
    case SkillAliases.TOTAL_ALIAS1:
      fieldToCheck = Skills.TOTAL;
      break;
    case SkillAliases.TOTAL_ALIAS2:
      fieldToCheck = Skills.TOTAL;
      break;
    case SkillAliases.ATTACK_ALIAS1:
      fieldToCheck = Skills.ATT;
      break;
    case SkillAliases.ATTACK_ALIAS2:
      fieldToCheck = Skills.ATT;
      break;
    case SkillAliases.DEFENCE_ALIAS1:
      fieldToCheck = Skills.DEF;
      break;
    case SkillAliases.DEFENCE_ALIAS2:
      fieldToCheck = Skills.DEF;
      break;
    case SkillAliases.STRENGTH_ALIAS1:
      fieldToCheck = Skills.STR;
      break;
    case SkillAliases.STRENGTH_ALIAS2:
      fieldToCheck = Skills.STR;
      break;
    case SkillAliases.HP_ALIAS1:
      fieldToCheck = Skills.HP;
      break;
    case SkillAliases.HP_ALIAS2:
      fieldToCheck = Skills.HP;
      break;
    case SkillAliases.RANGED_ALIAS1:
      fieldToCheck = Skills.RANGED;
      break;
    case SkillAliases.RANGED_ALIAS2:
      fieldToCheck = Skills.RANGED;
      break;
    case SkillAliases.PRAYER_ALIAS1:
      fieldToCheck = Skills.PRAY;
      break;
    case SkillAliases.PRAYER_ALIAS2:
      fieldToCheck = Skills.PRAY;
      break;
    case SkillAliases.MAGIC_ALIAS1:
      fieldToCheck = Skills.MAGIC;
      break;
    case SkillAliases.MAGIC_ALIAS2:
      fieldToCheck = Skills.MAGIC;
      break;
    case SkillAliases.COOKING_ALIAS1:
      fieldToCheck = Skills.COOK;
      break;
    case SkillAliases.COOKING_ALIAS2:
      fieldToCheck = Skills.COOK;
      break;
    case SkillAliases.WC_ALIAS1:
      fieldToCheck = Skills.WC;
      break;
    case SkillAliases.WC_ALIAS2:
      fieldToCheck = Skills.WC;
      break;
    case SkillAliases.FLETCH_ALIAS1:
      fieldToCheck = Skills.FLETCH;
      break;
    case SkillAliases.FLETCH_ALIAS2:
      fieldToCheck = Skills.FLETCH;
      break;
    case SkillAliases.FISH_ALIAS1:
      fieldToCheck = Skills.FISH;
      break;
    case SkillAliases.FLETCH_ALIAS2:
      fieldToCheck = Skills.FISH;
      break;
    case SkillAliases.FM_ALIAS1:
      fieldToCheck = Skills.FM;
      break;
    case SkillAliases.FM_ALIAS2:
      fieldToCheck = Skills.FM;
      break;
    case SkillAliases.FM_ALIAS3:
      fieldToCheck = Skills.FM;
      break;
    case SkillAliases.CRAFT_ALIAS1:
      fieldToCheck = Skills.CRAFT;
      break;
    case SkillAliases.CRAFT_ALIAS2:
      fieldToCheck = Skills.CRAFT;
      break;
    case SkillAliases.SMITH_ALIAS1:
      fieldToCheck = Skills.SMITH;
      break;
    case SkillAliases.SMITH_ALIAS2:
      fieldToCheck = Skills.SMITH;
      break;
    case SkillAliases.MINING_ALIAS1:
      fieldToCheck = Skills.MINING;
      break;
    case SkillAliases.MINING_ALIAS2:
      fieldToCheck = Skills.MINING;
      break;
    case SkillAliases.HERB_ALIAS1:
      fieldToCheck = Skills.HERB;
      break;
    case SkillAliases.HERB_ALIAS2:
      fieldToCheck = Skills.HERB;
      break;
    case SkillAliases.AGIL_ALIAS1:
      fieldToCheck = Skills.AGIL;
      break;
    case SkillAliases.AGIL_ALIAS2:
      fieldToCheck = Skills.AGIL;
      break;
    case SkillAliases.THIEV_ALIAS1:
      fieldToCheck = Skills.THIEV;
      break;
    case SkillAliases.THIEV_ALIAS2:
      fieldToCheck = Skills.THIEV;
      break;
    case SkillAliases.SLAY_ALIAS1:
      fieldToCheck = Skills.SLAYER;
      break;
    case SkillAliases.SLAY_ALIAS2:
      fieldToCheck = Skills.SLAYER;
      break;
    case SkillAliases.FARM_ALIAS1:
      fieldToCheck = Skills.FARM;
      break;
    case SkillAliases.FARM_ALIAS2:
      fieldToCheck = Skills.FARM;
      break;
    case SkillAliases.RC_ALIAS1:
      fieldToCheck = Skills.RC;
      break;
    case SkillAliases.RC_ALIAS2:
      fieldToCheck = Skills.RC;
      break;
    case SkillAliases.RC_ALIAS3:
      fieldToCheck = Skills.RC;
      break;
    case SkillAliases.HUNT_ALIAS1:
      fieldToCheck = Skills.HUNT;
      break;
    case SkillAliases.HUNT_ALIAS2:
      fieldToCheck = Skills.HUNT;
      break;
    case SkillAliases.CONSTR_ALIAS1:
      fieldToCheck = Skills.CON;
      break;
    case SkillAliases.CONSTR_ALIAS2:
      fieldToCheck = Skills.CON;
      break;
    case SkillAliases.CONSTR_ALIAS3:
      fieldToCheck = Skills.CON;
      break;
    case SkillAliases.CONSTR_ALIAS4:
      fieldToCheck = Skills.CON;
      break;
    default:
      return;
  }
  return fieldToCheck;
};

export const bossFields = (fieldName: string): string | undefined => {
  let fieldToCheck: string;
  switch (fieldName) {
    case BossAliases.SIRE_ALIAS1:
      fieldToCheck = Bosses.SIRE;
      break;
    case BossAliases.SIRE_ALIAS2:
      fieldToCheck = Bosses.SIRE;
      break;
    case BossAliases.HYDRA_ALIAS1:
      fieldToCheck = Bosses.HYDRA;
      break;
    case BossAliases.HYDRA_ALIAS2:
      fieldToCheck = Bosses.HYDRA;
      break;
    case BossAliases.BARROWS_ALIAS1:
      fieldToCheck = Bosses.BARROWS;
      break;
    case BossAliases.BRYOPHYTA_ALIAS1:
      fieldToCheck = Bosses.BRYOPHYTA;
      break;
    case BossAliases.BRYOPHYTA_ALIAS2:
      fieldToCheck = Bosses.BRYOPHYTA;
      break;
    case BossAliases.CALLISTO_ALIAS1:
      fieldToCheck = Bosses.CALLISTO;
      break;
    case BossAliases.CERBERUS_ALIAS1:
      fieldToCheck = Bosses.CERBERUS;
      break;
    case BossAliases.CERBERUS_ALIAS2:
      fieldToCheck = Bosses.CERBERUS;
      break;
    case BossAliases.COX_ALIAS1:
      fieldToCheck = Bosses.COX;
      break;
    case BossAliases.COX_ALIAS2:
      fieldToCheck = Bosses.COX;
      break;
    case BossAliases.COX_ALIAS3:
      fieldToCheck = Bosses.COX;
      break;
    case BossAliases.COXCM_ALIAS1:
      fieldToCheck = Bosses.COXCM;
      break;
    case BossAliases.COXCM_ALIAS2:
      fieldToCheck = Bosses.COXCM;
      break;
    case BossAliases.COXCM_ALIAS3:
      fieldToCheck = Bosses.COXCM;
      break;
    case BossAliases.CHAOS_ELE_ALIAS1:
      fieldToCheck = Bosses.CHAOS_ELE;
      break;
    case BossAliases.CHAOS_ELE_ALIAS2:
      fieldToCheck = Bosses.CHAOS_ELE;
      break;
    case BossAliases.CHAOS_ELE_ALIAS3:
      fieldToCheck = Bosses.CHAOS_ELE;
      break;
    case BossAliases.CHAOS_FANATIC_ALIAS1:
      fieldToCheck = Bosses.CHAOS_FANATIC;
      break;
    case BossAliases.CHAOS_FANATIC_ALIAS2:
      fieldToCheck = Bosses.CHAOS_FANATIC;
      break;
    case BossAliases.SARADOMIN_ALIAS1:
      fieldToCheck = Bosses.ZILYANA;
      break;
    case BossAliases.SARADOMIN_ALIAS2:
      fieldToCheck = Bosses.ZILYANA;
      break;
    case BossAliases.SARADOMIN_ALIAS3:
      fieldToCheck = Bosses.ZILYANA;
      break;
    case BossAliases.SARADOMIN_ALIAS4:
      fieldToCheck = Bosses.ZILYANA;
      break;
    case BossAliases.CORP_ALIAS1:
      fieldToCheck = Bosses.CORP;
      break;
    case BossAliases.CORP_ALIAS2:
      fieldToCheck = Bosses.CORP;
      break;
    case BossAliases.CRAZY_ARCH_ALIAS1:
      fieldToCheck = Bosses.CRAZY_ARCH;
      break;
    case BossAliases.CRAZY_ARCH_ALIAS2:
      fieldToCheck = Bosses.CRAZY_ARCH;
      break;
    case BossAliases.PRIME_ALIAS1:
      fieldToCheck = Bosses.PRIME;
      break;
    case BossAliases.PRIME_ALIAS2:
      fieldToCheck = Bosses.PRIME;
      break;
    case BossAliases.REX_ALIAS1:
      fieldToCheck = Bosses.REX;
      break;
    case BossAliases.REX_ALIAS2:
      fieldToCheck = Bosses.REX;
      break;
    case BossAliases.SUPREME_ALIAS1:
      fieldToCheck = Bosses.SUPREME;
      break;
    case BossAliases.SUPREME_ALIAS2:
      fieldToCheck = Bosses.SUPREME;
      break;
    case BossAliases.DERANGED_ALIAS1:
      fieldToCheck = Bosses.DER_ARCH;
      break;
    case BossAliases.DERANGED_ALIAS2:
      fieldToCheck = Bosses.DER_ARCH;
      break;
    case BossAliases.DERANGED_ALIAS3:
      fieldToCheck = Bosses.DER_ARCH;
      break;
    case BossAliases.BANDOS_ALIAS1:
      fieldToCheck = Bosses.GRAARDOR;
      break;
    case BossAliases.BANDOS_ALIAS2:
      fieldToCheck = Bosses.GRAARDOR;
      break;
    case BossAliases.BANDOS_ALIAS3:
      fieldToCheck = Bosses.GRAARDOR;
      break;
    case BossAliases.MOLE_ALIAS1:
      fieldToCheck = Bosses.MOLE;
      break;
    case BossAliases.MOLE_ALIAS2:
      fieldToCheck = Bosses.MOLE;
      break;
    case BossAliases.GUARDIANS_ALIAS1:
      fieldToCheck = Bosses.GUARDIANS;
      break;
    case BossAliases.GUARDIANS_ALIAS2:
      fieldToCheck = Bosses.GUARDIANS;
      break;
    case BossAliases.GUARDIANS_ALIAS3:
      fieldToCheck = Bosses.GUARDIANS;
      break;
    case BossAliases.GUARDIANS_ALIAS4:
      fieldToCheck = Bosses.GUARDIANS;
      break;
    case BossAliases.GUARDIANS_ALIAS5:
      fieldToCheck = Bosses.GUARDIANS;
      break;
    case BossAliases.HESPORI_ALIAS1:
      fieldToCheck = Bosses.HESPORI;
      break;
    case BossAliases.KQ_ALIAS1:
      fieldToCheck = Bosses.KQ;
      break;
    case BossAliases.KQ_ALIAS2:
      fieldToCheck = Bosses.KQ;
      break;
    case BossAliases.KQ_ALIAS3:
      fieldToCheck = Bosses.KQ;
      break;
    case BossAliases.KBD_ALIAS1:
      fieldToCheck = Bosses.KBD;
      break;
    case BossAliases.KBD_ALIAS2:
      fieldToCheck = Bosses.KBD;
      break;
    case BossAliases.KRAKEN_ALIAS1:
      fieldToCheck = Bosses.KRAKEN;
      break;
    case BossAliases.ARMA_ALIAS1:
      fieldToCheck = Bosses.KREE;
      break;
    case BossAliases.ARMA_ALIAS2:
      fieldToCheck = Bosses.KREE;
      break;
    case BossAliases.ARMA_ALIAS3:
      fieldToCheck = Bosses.KREE;
      break;
    case BossAliases.ARMA_ALIAS4:
      fieldToCheck = Bosses.KREE;
      break;
    case BossAliases.ARMA_ALIAS5:
      fieldToCheck = Bosses.KREE;
      break;
    case BossAliases.ZAMMY_ALIAS1:
      fieldToCheck = Bosses.KRIL;
      break;
    case BossAliases.ZAMMY_ALIAS2:
      fieldToCheck = Bosses.KRIL;
      break;
    case BossAliases.ZAMMY_ALIAS3:
      fieldToCheck = Bosses.KRIL;
      break;
    case BossAliases.ZAMMY_ALIAS4:
      fieldToCheck = Bosses.KRIL;
      break;
    case BossAliases.ZAMMY_ALIAS5:
      fieldToCheck = Bosses.KRIL;
      break;
    case BossAliases.MIMIC_ALIAS1:
      fieldToCheck = Bosses.MIMIC;
      break;
    case BossAliases.NIGHTMARE_ALIAS1:
      fieldToCheck = Bosses.NIGHTMARE;
      break;
    case BossAliases.OBOR_ALIAS1:
      fieldToCheck = Bosses.OBOR;
      break;
    case BossAliases.SARACHNIS_ALIAS1:
      fieldToCheck = Bosses.SARACHNIS;
      break;
    case BossAliases.SCORPIA_ALIAS1:
      fieldToCheck = Bosses.SCORPIA;
      break;
    case BossAliases.SKOTIZO_ALIAS1:
      fieldToCheck = Bosses.SKOTIZO;
      break;
    case BossAliases.TEMPOROSS_ALIAS1:
      fieldToCheck = Bosses.TEMPO;
      break;
    case BossAliases.TEMPOROSS_ALIAS2:
      fieldToCheck = Bosses.TEMPO;
      break;
    case BossAliases.GAUNTLET_ALIAS1:
      fieldToCheck = Bosses.GAUNTLET;
      break;
    case BossAliases.GAUNTLET_ALIAS2:
      fieldToCheck = Bosses.GAUNTLET;
      break;
    case BossAliases.CORR_GAUNTLET_ALIAS1:
      fieldToCheck = Bosses.CORR_GAUNTLET;
      break;
    case BossAliases.CORR_GAUNTLET_ALIAS2:
      fieldToCheck = Bosses.CORR_GAUNTLET;
      break;
    case BossAliases.CORR_GAUNTLET_ALIAS3:
      fieldToCheck = Bosses.CORR_GAUNTLET;
      break;
    case BossAliases.CORR_GAUNTLET_ALIAS4:
      fieldToCheck = Bosses.CORR_GAUNTLET;
      break;
    case BossAliases.CORR_GAUNTLET_ALIAS5:
      fieldToCheck = Bosses.CORR_GAUNTLET;
      break;
    case BossAliases.TOB_ALIAS1:
      fieldToCheck = Bosses.TOB;
      break;
    case BossAliases.TOB_ALIAS2:
      fieldToCheck = Bosses.TOB;
      break;
    case BossAliases.TOB_ALIAS3:
      fieldToCheck = Bosses.TOB;
      break;
    case BossAliases.THERMY_ALIAS1:
      fieldToCheck = Bosses.THERMY;
      break;
    case BossAliases.THERMY_ALIAS2:
      fieldToCheck = Bosses.THERMY;
      break;
    case BossAliases.THERMY_ALIAS3:
      fieldToCheck = Bosses.THERMY;
      break;
    case BossAliases.ZUK_ALIAS1:
      fieldToCheck = Bosses.ZUK;
      break;
    case BossAliases.ZUK_ALIAS2:
      fieldToCheck = Bosses.ZUK;
      break;
    case BossAliases.JAD_ALIAS1:
      fieldToCheck = Bosses.JAD;
      break;
    case BossAliases.JAD_ALIAS2:
      fieldToCheck = Bosses.JAD;
      break;
    case BossAliases.VENE_ALIAS1:
      fieldToCheck = Bosses.VENE;
      break;
    case BossAliases.VENE_ALIAS2:
      fieldToCheck = Bosses.VENE;
      break;
    case BossAliases.VETION_ALIAS1:
      fieldToCheck = Bosses.VETION;
      break;
    case BossAliases.VORK_ALIAS1:
      fieldToCheck = Bosses.VORKATH;
      break;
    case BossAliases.VORK_ALIAS2:
      fieldToCheck = Bosses.VORKATH;
      break;
    case BossAliases.WT_ALIAS1:
      fieldToCheck = Bosses.WT;
      break;
    case BossAliases.WT_ALIAS2:
      fieldToCheck = Bosses.WT;
      break;
    case BossAliases.ZALC_ALIAS1:
      fieldToCheck = Bosses.ZALCANO;
      break;
    case BossAliases.ZALC_ALIAS2:
      fieldToCheck = Bosses.ZALCANO;
      break;
    case BossAliases.ZULRAH_ALIAS1:
      fieldToCheck = Bosses.ZULRAH;
      break;
    default:
      return;
  }
  return fieldToCheck;
};

export const clueList: string[] = [
  ClueAliases.ALL,
  ClueAliases.BEGINNER,
  ClueAliases.EASY,
  ClueAliases.MEDIUM,
  ClueAliases.HARD,
  ClueAliases.ELITE,
  ClueAliases.MASTER,
];

export const skillList: string[] = [
  SkillAliases.TOTAL_ALIAS1,
  SkillAliases.TOTAL_ALIAS2,
  SkillAliases.ATTACK_ALIAS1,
  SkillAliases.ATTACK_ALIAS2,
  SkillAliases.DEFENCE_ALIAS1,
  SkillAliases.DEFENCE_ALIAS2,
  SkillAliases.STRENGTH_ALIAS1,
  SkillAliases.STRENGTH_ALIAS2,
  SkillAliases.HP_ALIAS1,
  SkillAliases.HP_ALIAS2,
  SkillAliases.RANGED_ALIAS1,
  SkillAliases.RANGED_ALIAS2,
  SkillAliases.PRAYER_ALIAS1,
  SkillAliases.PRAYER_ALIAS2,
  SkillAliases.MAGIC_ALIAS1,
  SkillAliases.MAGIC_ALIAS2,
  SkillAliases.COOKING_ALIAS1,
  SkillAliases.COOKING_ALIAS2,
  SkillAliases.WC_ALIAS1,
  SkillAliases.WC_ALIAS2,
  SkillAliases.FLETCH_ALIAS1,
  SkillAliases.FLETCH_ALIAS2,
  SkillAliases.FISH_ALIAS1,
  SkillAliases.FISH_ALIAS2,
  SkillAliases.FM_ALIAS1,
  SkillAliases.FM_ALIAS2,
  SkillAliases.FM_ALIAS3,
  SkillAliases.CRAFT_ALIAS1,
  SkillAliases.CONSTR_ALIAS2,
  SkillAliases.SMITH_ALIAS1,
  SkillAliases.SMITH_ALIAS2,
  SkillAliases.MINING_ALIAS1,
  SkillAliases.MINING_ALIAS2,
  SkillAliases.HERB_ALIAS1,
  SkillAliases.HERB_ALIAS2,
  SkillAliases.AGIL_ALIAS1,
  SkillAliases.AGIL_ALIAS2,
  SkillAliases.THIEV_ALIAS1,
  SkillAliases.THIEV_ALIAS2,
  SkillAliases.SLAY_ALIAS1,
  SkillAliases.SLAY_ALIAS2,
  SkillAliases.FARM_ALIAS1,
  SkillAliases.FARM_ALIAS2,
  SkillAliases.RC_ALIAS1,
  SkillAliases.RC_ALIAS2,
  SkillAliases.RC_ALIAS3,
  SkillAliases.HUNT_ALIAS1,
  SkillAliases.HUNT_ALIAS2,
  SkillAliases.CONSTR_ALIAS1,
  SkillAliases.CONSTR_ALIAS2,
  SkillAliases.CONSTR_ALIAS3,
  SkillAliases.CONSTR_ALIAS4,
];

export const bossList: string[] = [
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
  BossAliases.TEMPOROSS_ALIAS1,
  BossAliases.TEMPOROSS_ALIAS2,
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
