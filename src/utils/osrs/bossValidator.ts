import { BossAliases } from './enums';
/* 
  Boss list is an array of lowercase joined boss name e.g "abyssalsire". 
  User input is a string array e.g ["abyssal", "sire", "zezima"]
  
  First check if there is any input (args.length === 0). If not return error (msg). Then check special cases (3 argument boss name eg. theatre of blood). Then filter boss list and check if args[0] (string) is included in any element (string). If true then check if [args[0], args[1]].join('') (string, exact match) is included boss array. If this check passes, then boss = [args[0], args[1]].join(''), else boss = args[0]. 

  User to search for is args.slice(<length of args that are the boss name>)
  */

export enum BossCases {
  INVALID = 0,
  ONE_WORD = 1,
  TWO_WORD = 2,
  THREE_WORDS = 3,
  EDGE_CASE = 4,
}

enum Indexes {
  FIRST_WORD = 0,
  SECOND_WORD = 1,
  THIRD_WORD = 2,
}

export const bossValidator = (
  lowerCasedArguments: string[],
  indexes: number[]
):
  | {
      bossCase: number;
      boss: string;
    }
  | undefined => {
  if (lowerCasedArguments.length === 0) return;
  const firstArgument: string =
    lowerCasedArguments[indexes[Indexes.FIRST_WORD]];
  const twoArgumentsJoined: string = [
    lowerCasedArguments[indexes[Indexes.FIRST_WORD]],
    lowerCasedArguments[indexes[Indexes.SECOND_WORD]],
  ]
    .join('')
    .toLowerCase();
  const specialCase: string = [
    lowerCasedArguments[indexes[Indexes.FIRST_WORD]],
    lowerCasedArguments[indexes[Indexes.SECOND_WORD]],
    lowerCasedArguments[indexes[Indexes.THIRD_WORD]],
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
    bossCase = BossCases.THREE_WORDS;
    boss = specialCase;
  } else {
    const firstCheck: string[] = bossList.filter((e: string) => {
      return e.includes(firstArgument);
    });
    if (firstCheck.length > 0 && lowerCasedArguments.length > 1) {
      const secondCheck: boolean = bossList.includes(twoArgumentsJoined);

      // This is for edge cases like ".kc deranged archeologist"
      if (secondCheck === true && lowerCasedArguments.length === 2) {
        boss = firstArgument;
        bossCase = BossCases.EDGE_CASE;
      } else if (secondCheck === true) {
        bossCase = BossCases.TWO_WORD;
        boss = twoArgumentsJoined;
      } else {
        bossCase = BossCases.ONE_WORD;
        boss = firstArgument;
      }
    } else if (firstCheck.length > 0 && lowerCasedArguments.length === 1) {
      bossCase = BossCases.EDGE_CASE;
      boss = firstArgument;
    } else {
      return;
    }
  }

  return {
    bossCase,
    boss,
  };
};

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
