import { Message } from 'discord.js';
import {
  BossAliases,
  Bosses,
  SkillAliases,
  TempleMinigamesOther,
  TempleMinigamesOtherAliases,
  ClueAliases,
  Clues,
  Skills,
} from '../../utils/osrs/enums';
import { Embed, EmbedTitles, usernameString } from '../../utils/embed';
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
import {
  fetchTemple,
  CacheTypes,
  playerRecords,
  PlayerRecords,
} from '../../cache/templeCache';
import { clueTypes } from '../osrs/clues';
import { skillList } from '../osrs/lvl';
import { bosses } from '../osrs/kc';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { bossValidator } from '../../utils/osrs/bossValidator';

// Valid first arguments
enum ValidRecords {
  CLUES = 'clues',
  BOSS = 'boss',
  SKILL = 'skill',
  OTHER = 'other',
}
const recordTypes: (ValidRecords | string)[] = [
  ValidRecords.CLUES,
  ValidRecords.BOSS,
  ValidRecords.SKILL,
  ValidRecords.OTHER,
];
const timeTypes = ['day', 'week', 'month', 'year'];
const timeTypesAll = ['6h', ...timeTypes];
const otherTypes = ['lms', 'ehb', 'ehp'];
// TODO: When Temporos gets added I can remove this check
const bossTypes = bosses.filter((e: string) => {
  return e !== 'tempoross' || 'temp';
});

enum FirstArgumentType {
  FAILED = 0,
  CLUES = 1,
  OTHER = 2,
  SKILL = 3,
  BOSS_ONE_WORD = 4,
  BOSS_TWO_WORD = 5,
  BOSS_THREE_WORD = 6,
}

export const record = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  let validFirstArgument: string;
  if (args.length === 0)
    return msg.channel.send(
      new Embed().setDescription(
        '**Please provide arguments. Valid formats**:```.record clues tier time username\n\n.record lms time username\n\n.record skill skill-name time username\n\n.record boss boss-name time username```'
      )
    );
  if (!recordTypes.includes(args[0].toLowerCase()))
    return msg.channel.send(
      invalidPrefixMsg(Categories.RECORD, recordTypes.join(', '))
    );
  else validFirstArgument = args[0].toLowerCase();
  if (args[1] === undefined)
    return msg.channel.send(
      new Embed().setDescription('**Please provide a second argument.**')
    );
  let inputFieldName: string;
  let isFirstArgumentValid: boolean;
  let firstArgumentType: number;
  switch (validFirstArgument) {
    case ValidRecords.CLUES:
      if (!clueTypes.includes(args[1].toLowerCase()))
        return msg.channel.send(
          invalidPrefixMsg(Categories.CLUES, clueTypes.join(', '))
        );
      else {
        isFirstArgumentValid = true;
        firstArgumentType = FirstArgumentType.CLUES;
        inputFieldName = args[1].toLowerCase();
      }
      break;
    case ValidRecords.OTHER:
      if (!otherTypes.includes(args[1].toLowerCase()))
        return msg.channel.send(
          invalidPrefixMsg(Categories.OTHER, otherTypes.join(', '))
        );
      else {
        isFirstArgumentValid = true;
        firstArgumentType = FirstArgumentType.OTHER;
        inputFieldName = args[1].toLowerCase();
      }
      break;
    case ValidRecords.SKILL:
      if (!skillList.includes(args[1].toLowerCase()))
        return msg.channel.send(
          invalidPrefixMsg(Categories.SKILL, skillList.join(', '))
        );
      else {
        isFirstArgumentValid = true;
        firstArgumentType = FirstArgumentType.SKILL;
        inputFieldName = args[1].toLowerCase();
      }
      break;
    case ValidRecords.BOSS:
      const indexes: number[] = [1, 2, 3];
      const bossValidation: {
        bossWordLength: number;
        boss: string;
      } = bossValidator(args, indexes);
      if (bossValidation.bossWordLength === 0)
        return msg.channel.send(
          invalidPrefixMsg(Categories.BOSS, bossTypes.join(', '))
        );
      else if (bossValidation.bossWordLength === 1) {
        isFirstArgumentValid = true;
        firstArgumentType = FirstArgumentType.BOSS_ONE_WORD;
      } else if (bossValidation.bossWordLength === 2) {
        isFirstArgumentValid = true;
        firstArgumentType = FirstArgumentType.BOSS_TWO_WORD;
      } else {
        isFirstArgumentValid = true;
        firstArgumentType = FirstArgumentType.BOSS_THREE_WORD;
      }
      inputFieldName = bossValidation.boss;
      const bossToArray: string[] = [inputFieldName];
      const finalCheck: string | null = isPrefixValid(
        msg,
        bossToArray,
        bosses,
        Categories.BOSS
      );
      if (finalCheck === null) return;
      else {
        isFirstArgumentValid = true;
        inputFieldName = inputFieldName;
      }
      break;

    default: {
      isFirstArgumentValid = false;
      firstArgumentType = FirstArgumentType.FAILED;
      inputFieldName = '';
    }
  }
  let time: string;
  let rsn: string[];
  if (isFirstArgumentValid === true) {
    switch (firstArgumentType) {
      case FirstArgumentType.OTHER:
        if (!timeTypesAll.includes(args[2].toLowerCase()))
          return msg.channel.send(
            invalidPrefixMsg(Categories.TIME_LMS, timeTypesAll.join(', '))
          );
        else {
          rsn = args.slice(3);
          time = args[2].toLowerCase();
        }
        break;
      case FirstArgumentType.CLUES:
        if (!timeTypes.includes(args[2].toLowerCase()))
          return msg.channel.send(
            invalidPrefixMsg(Categories.TIME, timeTypes.join(', '))
          );
        else {
          rsn = args.slice(3);
          time = args[2].toLowerCase();
        }
        break;
      case FirstArgumentType.SKILL:
        if (!timeTypesAll.includes(args[2].toLowerCase()))
          return msg.channel.send(
            invalidPrefixMsg(Categories.TIME, timeTypesAll.join(', '))
          );
        else {
          rsn = args.slice(3);
          time = args[2].toLowerCase();
        }
        break;
      case FirstArgumentType.BOSS_ONE_WORD:
        if (!timeTypes.includes(args[2].toLowerCase()))
          return msg.channel.send(
            invalidPrefixMsg(Categories.TIME, timeTypes.join(', '))
          );
        else {
          rsn = args.slice(3);
          time = args[2].toLowerCase();
        }
        break;
      case FirstArgumentType.BOSS_TWO_WORD:
        if (!timeTypes.includes(args[3].toLowerCase()))
          return msg.channel.send(
            invalidPrefixMsg(Categories.TIME, timeTypes.join(', '))
          );
        else {
          rsn = args.slice(4);
          time = args[3].toLowerCase();
        }
        break;
      case FirstArgumentType.BOSS_THREE_WORD:
        if (!timeTypes.includes(args[4].toLowerCase()))
          return msg.channel.send(
            invalidPrefixMsg(Categories.TIME, timeTypes.join(', '))
          );
        else {
          rsn = args.slice(5);
          time = args[4].toLowerCase();
        }
        break;

      default:
        time = 'Fail';
        rsn = ['Fail'];
    }
  } else return msg.channel.send(new Embed().setDescription('Error'));

  const cooldown: number = 30;
  if (rsn === undefined) return msg.channel.send(invalidUsername);
  const nameCheck: string | null = runescapeNameValidator(rsn);
  if (nameCheck === null) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  if (
    isOnCooldown(
      msg,
      commandName,
      cooldown,
      false,
      args.join('').toLowerCase()
    ) === true
  )
    return;
  const embed: Embed = new Embed()
    .setTitle(EmbedTitles.RECORDS)
    .addField(usernameString, `${username}`);
  if (username in playerRecords) {
    const field: string = fieldNameCheck(inputFieldName);
    const result: Embed = generateResult(
      field,
      embed,
      playerRecords[username],
      time,
      args
    );
    return msg.channel.send(result);
  } else {
    const dataType: CacheTypes = CacheTypes.PLAYER_RECORDS;
    const isFetched: boolean = await fetchTemple(msg, username, dataType);
    if (isFetched === true) {
      const field: string = fieldNameCheck(inputFieldName);
      const result: Embed = generateResult(
        field,
        embed,
        playerRecords[username],
        time,
        args
      );
      return msg.channel.send(result);
    } else return;
  }
};

// Generates embed sent to user
const generateResult = (
  field: string,
  embed: Embed,
  playerObject: PlayerRecords,
  time: string,
  args: string[]
): Embed => {
  // Changing the time value (string) to have a first capital letter
  const capitalFirst: string = capitalizeFirstLetter(time);
  let formattedField: string;
  embed.setFooter('Incorrect? Fetch latest data:\n.fetchrecords username');
  switch (field) {
    case Clues.ALL:
      formattedField = 'All Clues';
      break;
    case Clues.BEGINNER:
      formattedField = 'Beginner Clues';
      break;
    case Clues.EASY:
      formattedField = 'Easy Clues';
      break;
    case Clues.MEDIUM:
      formattedField = 'Medium Clues';
      break;
    case Clues.HARD:
      formattedField = 'Hard Clues';
      break;
    case Clues.ELITE:
      formattedField = 'Hard Clues';
      break;
    case Clues.MASTER:
      formattedField = 'Master Clues';
      break;
    case Skills.TEMPLE_RC:
      formattedField = Skills.RC;
      break;
    case TempleMinigamesOther.EHB:
      formattedField = field.toUpperCase();
      break;
    case TempleMinigamesOther.EHP:
      formattedField = field.toUpperCase();
      break;

    default:
      formattedField = field;
      break;
  }

  // If there are no records the key value is an empty array
  if (Array.isArray(playerObject[field]) === false) {
    // If there's no record for specific period of time then the key doesn't exist
    if (playerObject[field][time] !== undefined) {
      // Formatting how numbers are displayed
      const value: string | number = playerObject[field][time].xp;
      let formattedValue;

      if (args[0].toLowerCase() === 'other')
        formattedValue = parseInt(value as string);
      else {
        const formatter: Intl.NumberFormat = new Intl.NumberFormat('en-US');
        formattedValue = formatter.format(value as number);
      }
      // Changing sufix depending on whether the type is skill or not
      let ending: string;
      if (args[0].toLowerCase() === 'skill') ending = ' xp';
      else ending = '';
      // Formatting date
      const stringToDate: Date = new Date(playerObject[field][time].date);
      const formattedDate: string = new Intl.DateTimeFormat('en-GB').format(
        stringToDate
      );
      embed.addField('Time Period', `${capitalFirst}`);
      embed.addField(`${formattedField}`, `${formattedValue}${ending}`);
      embed.addField('Record set on:', `${formattedDate}`);
    } else {
      embed.addField(`Time Period`, `${capitalFirst}`);
      embed.addField(
        `NO DATA`,
        `No records for this period of time for ${formattedField}`
      );
    }
  } else {
    embed.addField(`NO DATA`, `No records for ${formattedField}`);
  }
  return embed;
};

// TODO: Add Tempoross when Temple updates
export const fieldNameCheck = (fieldName: string): string => {
  let fieldToCheck;
  switch (fieldName) {
    case TempleMinigamesOtherAliases.EHB:
      fieldToCheck = TempleMinigamesOther.EHB;
      break;
    case TempleMinigamesOtherAliases.EHP:
      fieldToCheck = TempleMinigamesOther.EHP;
      break;
    case TempleMinigamesOtherAliases.LMS:
      fieldToCheck = TempleMinigamesOther.LMS;
      break;
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
      fieldToCheck = Skills.TEMPLE_RC;
      break;
    case SkillAliases.RC_ALIAS2:
      fieldToCheck = Skills.TEMPLE_RC;
      break;
    case SkillAliases.RC_ALIAS3:
      fieldToCheck = Skills.TEMPLE_RC;
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
      fieldToCheck = '[]';
  }
  return fieldToCheck;
};
