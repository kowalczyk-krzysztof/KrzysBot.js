import { bosses } from '../../commands/osrs/kc';
import { BossAliases } from './enums';
/* 
  Boss list is an array of lowercase joined boss name e.g "abyssalsire". 
  User input is a string array e.g ["abyssal", "sire", "zezima"]
  
  First check if there is any input (args.length === 0). If not return error (msg). Then check special cases (3 argument boss name eg. theatre of blood). Then filter boss list and check if args[0] (string) is included in any element (string). If true then check if [args[0], args[1]].join('') (string, exact match) is included in any boss array element. If this check passes, then boss = [args[0], args[1]].join(''), else boss = args[0]. Then do another exact match check to eliminate cases like ".kc dagannoth" which pass the checks but are not valid bosses.

  User to search for is args.slice(<length of args that are the boss name>)
  */
export const bossValidator = (
  lowerCasedArguments: string[],
  indexes: number[]
): {
  bossCase: number;
  boss: string;
} => {
  if (lowerCasedArguments.length === 0)
    return {
      bossCase: 0,
      boss: '',
    };
  const firstArgument: string = lowerCasedArguments[indexes[0]];
  const twoArgumentsJoined: string = [
    lowerCasedArguments[indexes[0]],
    lowerCasedArguments[indexes[1]],
  ]
    .join('')
    .toLowerCase();
  const specialCase: string = [
    lowerCasedArguments[indexes[0]],
    lowerCasedArguments[indexes[1]],
    lowerCasedArguments[indexes[2]],
  ]
    .join('')
    .toLowerCase();

  let boss: string;
  let bossCase: number;

  if (
    specialCase === BossAliases.COX_ALIAS2 ||
    specialCase === BossAliases.TOB_ALIAS3 ||
    specialCase === BossAliases.KBD_ALIAS2 ||
    specialCase === BossAliases.THERMY_ALIAS3
  ) {
    bossCase = 3;
    boss = specialCase;
  } else {
    const firstCheck: string[] = bosses.filter((e: string) => {
      return e.includes(firstArgument);
    });
    if (firstCheck.length > 0) {
      const secondCheck = bosses.filter((e: string) => {
        return e.includes(twoArgumentsJoined);
      });
      // This is for edge cases like ".kc deranged archeologist"
      if (secondCheck.length > 0 && lowerCasedArguments.length === 2) {
        boss = firstArgument;
        bossCase = 3;
      } else if (secondCheck.length > 0) {
        bossCase = 2;
        boss = twoArgumentsJoined;
      } else {
        bossCase = 1;
        boss = firstArgument;
      }
    } else {
      bossCase = 0;
      boss = '';
    }
  }
  return {
    bossCase,
    boss,
  };
};
