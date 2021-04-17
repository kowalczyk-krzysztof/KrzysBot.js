import { bosses } from '../../commands/osrs/kc';
import { BossAliases } from './enums';
/* 
  Boss list is an array of lowercase joined boss name e.g "abyssalsire". 
  User input is a string array e.g ["abyssal", "sire", "zezima"]
  
  First check if there is any input (args.length === 0). If not return error (msg). Then check special cases (3 argument boss name eg. theatre of blood). Then filter boss list and check if args[0] (string) is included in any element (string). If true then check if [args[0], args[1]].join('') (string, exact match) is included in any boss array element. If this check passes, then boss = [args[0], args[1]].join(''), else boss = args[0]. Then do another exact match check to eliminate cases like ".kc dagannoth" which pass the checks but are not valid bosses.

  User to search for is args.slice(<length of args that are the boss name>)
  */
export const bossValidator = (
  args: string[],
  indexes: number[]
): {
  bossWordLength: number;
  boss: string;
} => {
  if (args.length === 0)
    return {
      bossWordLength: 0,
      boss: '',
    };
  const firstArgument: string = args[indexes[0]].toLowerCase();
  const twoArgumentsJoined: string = [args[indexes[0]], args[indexes[1]]]
    .join('')
    .toLowerCase();
  const specialCase: string = [
    args[indexes[0]],
    args[indexes[1]],
    args[indexes[2]],
  ]
    .join('')
    .toLowerCase();

  let boss: string;
  let bossWordLength: number;

  if (
    specialCase === BossAliases.COX_ALIAS2 ||
    specialCase === BossAliases.TOB_ALIAS3 ||
    specialCase === BossAliases.KBD_ALIAS2 ||
    specialCase === BossAliases.THERMY_ALIAS3
  ) {
    bossWordLength = 3;
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
      if (secondCheck.length > 0 && args.length === 2) {
        boss = firstArgument;
        bossWordLength = 1;
      } else if (secondCheck.length > 0) {
        bossWordLength = 2;
        boss = twoArgumentsJoined;
      } else {
        bossWordLength = 1;
        boss = firstArgument;
      }
    } else {
      bossWordLength = 0;
      boss = '';
    }
  }
  return {
    bossWordLength,
    boss,
  };
};
