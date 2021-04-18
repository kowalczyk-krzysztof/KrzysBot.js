import { Message } from 'discord.js';
import { clueTypes } from '../../commands/osrs/clues';
import { skillList } from '../../commands/osrs/lvl';
import { Embed } from '../embed';
import { BossCases, bossValidator, bossList } from './bossValidator';
import {
  BossAliases,
  Bosses,
  ClueAliases,
  Clues,
  SkillAliases,
  Skills,
  TempleOther,
  PlayerOverviewTimesAliases,
} from './enums';
import { Categories, invalidPrefixMsg } from './isPrefixValid';

// Valid first arguments
export enum ValidCases {
  CLUES = 'clues',
  BOSS = 'boss',
  SKILL = 'skill',
  OTHER = 'other',
}
const validCases: string[] = [
  ValidCases.CLUES,
  ValidCases.BOSS,
  ValidCases.SKILL,
  ValidCases.OTHER,
];
const timeTypes = ['day', 'week', 'month', 'year'];
const timeTypesAll = ['6h', ...timeTypes];
const otherTypes = ['lms', 'ehb', 'ehp'];
// TODO: When Temporos gets added I can remove this check
export const bossTypes = bossList.filter((e: string) => {
  return e !== 'tempoross' || 'temp';
});
const playerOverviewTimes: string[] = [
  PlayerOverviewTimesAliases.FIVEMIN,
  PlayerOverviewTimesAliases.DAY,
  PlayerOverviewTimesAliases.WEEK,
  PlayerOverviewTimesAliases.MONTH,
  PlayerOverviewTimesAliases.HALFYEAR,
  PlayerOverviewTimesAliases.YEAR,
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
  const lowerCasedArguments = args.map((e: string) => {
    return e.toLowerCase();
  });
  let conditionalTypeOther: string[];
  if (commandName === 'gains') conditionalTypeOther = [...otherTypes, 'imehp'];
  else conditionalTypeOther = otherTypes;
  if (args.length === 0) {
    msg.channel.send(
      new Embed().setDescription(
        '**Please provide arguments. Valid formats**:```.record clues tier time username\n\n.record lms time username\n\n.record skill skill-name time username\n\n.record boss boss-name time username```'
      )
    );
    return;
  }
  if (!validCases.includes(lowerCasedArguments[0])) {
    msg.channel.send(invalidPrefixMsg(Categories.EMPTY, validCases.join(', ')));
    return;
  } else {
    validFirstArgument = lowerCasedArguments[0];
  }
  let inputFieldName: string | undefined;
  let isFirstArgumentValid: boolean;
  let firstArgumentType: number;

  switch (validFirstArgument) {
    case ValidCases.CLUES:
      if (!clueTypes.includes(lowerCasedArguments[1])) {
        msg.channel.send(
          invalidPrefixMsg(Categories.CLUES, clueTypes.join(', '))
        );
        return;
      } else {
        isFirstArgumentValid = true;
        firstArgumentType = FirstArgumentType.CLUES;
        inputFieldName = lowerCasedArguments[1];
      }
      break;
    case ValidCases.OTHER:
      if (!conditionalTypeOther.includes(lowerCasedArguments[1])) {
        msg.channel.send(
          invalidPrefixMsg(Categories.OTHER, conditionalTypeOther.join(', '))
        );
        return;
      } else {
        isFirstArgumentValid = true;
        firstArgumentType = FirstArgumentType.OTHER;
        inputFieldName = lowerCasedArguments[1];
      }
      break;
    case ValidCases.SKILL:
      if (!skillList.includes(lowerCasedArguments[1])) {
        msg.channel.send(
          invalidPrefixMsg(Categories.SKILL, skillList.join(', '))
        );
        return;
      } else {
        isFirstArgumentValid = true;
        firstArgumentType = FirstArgumentType.SKILL;
        inputFieldName = lowerCasedArguments[1];
      }
      break;
    case ValidCases.BOSS:
      const indexes: number[] = [1, 2, 3];
      const bossValidation:
        | {
            bossCase: number;
            boss: string;
          }
        | undefined = bossValidator(lowerCasedArguments, indexes);
      if (bossValidation === undefined) {
        msg.channel.send(
          invalidPrefixMsg(Categories.BOSS, bossTypes.join(', '))
        );
        return;
      } else if (bossValidation.bossCase === BossCases.ONE_WORD) {
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
      inputFieldName = bossValidation.boss;
      break;
    default: {
      return;
    }
  }

  let time: string | undefined;
  let rsn: string[] | undefined;
  let fullArray: string[];
  let notFullArray: string[];
  if (commandName === 'gains') {
    fullArray = playerOverviewTimes;
    notFullArray = playerOverviewTimes;
  } else {
    fullArray = timeTypesAll;
    notFullArray = timeTypes;
  }

  if (isFirstArgumentValid === true) {
    switch (firstArgumentType) {
      case FirstArgumentType.OTHER:
        if (!fullArray.includes(lowerCasedArguments[2])) {
          msg.channel.send(
            invalidPrefixMsg(Categories.TIME_LMS, fullArray.join(', '))
          );
          return;
        } else {
          rsn = lowerCasedArguments.slice(3);
          time = lowerCasedArguments[2];
          notFullArray;
        }
        break;
      case FirstArgumentType.CLUES:
        if (!notFullArray.includes(lowerCasedArguments[2])) {
          msg.channel.send(
            invalidPrefixMsg(Categories.TIME, notFullArray.join(', '))
          );
          return;
        } else {
          rsn = lowerCasedArguments.slice(3);
          time = lowerCasedArguments[2];
        }
        break;
      case FirstArgumentType.SKILL:
        if (!fullArray.includes(lowerCasedArguments[2])) {
          msg.channel.send(
            invalidPrefixMsg(Categories.TIME, fullArray.join(', '))
          );
          return;
        } else {
          rsn = lowerCasedArguments.slice(3);
          time = lowerCasedArguments[2];
        }
        break;
      case FirstArgumentType.BOSS_ONE_WORD:
        if (!notFullArray.includes(lowerCasedArguments[2])) {
          msg.channel.send(
            invalidPrefixMsg(Categories.TIME, notFullArray.join(', '))
          );
          return;
        } else {
          rsn = lowerCasedArguments.slice(3);
          time = lowerCasedArguments[2];
        }
        break;
      case FirstArgumentType.BOSS_TWO_WORD:
        if (!notFullArray.includes(lowerCasedArguments[3])) {
          msg.channel.send(
            invalidPrefixMsg(Categories.TIME, notFullArray.join(', '))
          );
          return;
        } else {
          rsn = lowerCasedArguments.slice(4);
          time = lowerCasedArguments[3];
        }
        break;
      case FirstArgumentType.BOSS_THREE_WORD:
        if (!notFullArray.includes(lowerCasedArguments[4])) {
          msg.channel.send(
            invalidPrefixMsg(Categories.TIME, notFullArray.join(', '))
          );
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
// Take in a lowecase joined field e.g "theatreofblood". Check what case is fieldName and then perform relevant switch statement and return the field name eg. "Theatre Of Blood"
// TODO: Add Tempoross when Temple updates
export const fieldNameCheck = (
  fieldName: string,
  checkCase: string
): string | undefined => {
  let fieldToCheck: string | undefined;
  if (checkCase === ValidCases.BOSS) fieldToCheck = bossFields(fieldName);
  else if (checkCase === ValidCases.SKILL)
    fieldToCheck = skillFields(fieldName);
  else if (checkCase === ValidCases.CLUES) fieldToCheck = clueFields(fieldName);
  else if (checkCase === ValidCases.OTHER)
    fieldToCheck = otherFields(fieldName);
  return fieldToCheck;
};

const otherFields = (fieldName: string): string | undefined => {
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

const clueFields = (fieldName: string): string | undefined => {
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

const skillFields = (fieldName: string): string | undefined => {
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

const bossFields = (fieldName: string): string | undefined => {
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
      fieldToCheck = Bosses.GUARDIANS;
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
