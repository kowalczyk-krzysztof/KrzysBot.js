// Discord
import { Message } from 'discord.js';
// UTILS: Enums
import { BossAliases, BossCases } from './enums';
// UTILS: Input validator
import { bossList } from './inputValidator';
// UTILS: Prefix validator
import { PrefixCategories, invalidPrefixMsg } from './isPrefixValid';
/* 
  Boss list is an array of lowercase joined boss name e.g "abyssalsire". 
  User input is a string array e.g ["abyssal", "sire", "zezima"]
  
  First check if there is any input (!args.length). If not return error (msg). Then check special cases (3 argument boss name eg. theatre of blood). Then filter boss list and check if args[0] (string) is included in any element (string). If true then check if [args[0], args[1]].join('') (string, exact match) is included boss array. If this check passes, then boss = [args[0], args[1]].join(''), else boss = args[0]. 
  Then do a final check if boss is exact match to because names like "dagannoth" pass first check but are not valid boss names

  User to search for is args.slice(<length of args that are the boss name>)
  */

export type BossValidation = {
  bossCase: number | null;
  boss: string | null;
};

// Boss name validator for kc, records and gains commands
export const bossValidator = (
  msg: Message,
  args: string[]
): BossValidation | undefined => {
  if (!args.length) return;

  const formattedArgs: string[] = splitArguments(args);
  const result = {
    boss: '',
    bossCase: 0,
  };

  if (specialCaseCheck(formattedArgs[2])) {
    result.bossCase = BossCases.THREE_WORDS;
    result.boss = formattedArgs[2];
    return result;
  }

  const normalCaseCheck = bossList.filter((e: string) => {
    return e.includes(formattedArgs[1]);
  });

  if (normalCaseCheck && args.length === 2) {
    result.boss = formattedArgs[0];
    result.bossCase = BossCases.EDGE_CASE;
  } else if (normalCaseCheck) {
    result.bossCase = BossCases.TWO_WORD;
    result.boss = formattedArgs[1];
  } else if (!normalCaseCheck && args.length === 1) {
    result.bossCase = BossCases.EDGE_CASE;
    result.boss = formattedArgs[0];
  } else {
    result.bossCase = BossCases.ONE_WORD;
    result.boss = formattedArgs[0];
  }

  if (bossList.includes(result.boss as string)) return result;
  if (result.bossCase === BossCases.EDGE_CASE) {
    msg.channel.send(
      invalidPrefixMsg(bossList, PrefixCategories.BOSS_EDGE_CASE)
    );
  } else msg.channel.send(invalidPrefixMsg(bossList, PrefixCategories.BOSS));
};

const splitArguments = (args: string[]): string[] => {
  const result: string[] = [
    args[0],
    args[0] + args[1],
    args[0] + args[1] + args[2],
  ];
  return result;
};

const specialCaseCheck = (args: string): BossValidation | undefined => {
  const result = {
    boss: '',
    bossCase: 0,
  };
  switch (args) {
    case BossAliases.COX_ALIAS2:
      result.boss = args;
      result.bossCase = BossCases.THREE_WORDS;
      return result;
    case BossAliases.TOB_ALIAS3:
      result.boss = args;
      result.bossCase = BossCases.THREE_WORDS;
      return result;
    case BossAliases.KBD_ALIAS2:
      result.boss = args;
      result.bossCase = BossCases.THREE_WORDS;
      return result;
    case BossAliases.THERMY_ALIAS3:
      result.boss = args;
      result.bossCase = BossCases.THREE_WORDS;
      return result;
    default:
      return;
  }
};
