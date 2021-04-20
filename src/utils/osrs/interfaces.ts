// UTILS: Enums
import {
  Skills,
  Bosses,
  Clues,
  OsrsOther,
  TempleOther,
  TempleGameMode,
} from './enums';
// TempleOSRS overview type other main interface
export interface TempleOverviewOther {
  [TempleOther.INFO]: TempleOtherInfo;
  [TempleOther.TABLE]: TempleOtherTable;
}
// Interface for TempleOSRS overview (other) info key
export interface TempleOtherInfo {
  [TempleOther.LAST_CHECK_TEXT]: string;
  [TempleOther.HOURS_PLAYED]: number;
  [TempleOther.HOURS_PER_DAY]: number;
  [TempleOther.BOSS_KILLS]: number;
  [TempleOther.KC_PER_DAY]: number;
  [TempleOther.AVR_KCH]: number;
  [TempleOther.TOP_BOSS]: number;
  [TempleOther.GP_EARNED]: number | string;
}
// Interface for TempleOSRS overview (other) table key
export interface TempleOtherTable extends Osrs<TempleOtherTableProps> {
  [TempleOther.EHB]: TempleOtherTableProps;
}
// Props for TempleOtherTable
export interface TempleOtherTableProps extends TempleOverviewTable {
  [TempleOther.EHB_LOWERCASE]: number;
}
// TempleOSRS overview type skill main interface
export interface TempleOverviewSkill {
  [TempleOther.INFO]: TempleSkillInfo;
  [TempleOther.TABLE]: TempleSkillTable;
}
// Interface for TempleOSRS overview (skill) info key
export interface TempleSkillInfo {
  [TempleOther.LAST_CHECK_TEXT]: string;
  [TempleOther.HOURS_PLAYED]: number;
  [TempleOther.HOURS_PER_DAY]: number;
  [TempleOther.XP_GAINED]: number;
  [TempleOther.XP_PER_DAY]: number;
  [TempleOther.AVR_XPH]: number;
  [TempleOther.TOP_SKILL]: number;
  [TempleOther.GP_SPENT]: number | string;
}
// Interface for TempleOSRS overview (skill) table key
export interface TempleSkillTable extends Osrs<SkillTableProps> {
  [TempleOther.EHP]: SkillTableProps;
  [TempleOther.IM_EHP]: SkillTableProps;
}
// Props for TempleSkillTable
export interface SkillTableProps extends TempleOverviewTable {
  [TempleOther.LEVEL]: number;
  [TempleOther.EHP_LOWERCASE]: number;
}

// General TempleOSRS overview table field (common properties)
interface TempleOverviewTable {
  [TempleOther.XP]: number;
  [TempleOther.RANK]: number;
}
// Interface for TempleOSRS player records
export interface TemplePlayerRecords extends Osrs<PlayerRecordsTimes> {
  [TempleOther.EHB]: PlayerRecordsTimes;
  [TempleOther.EHP]: PlayerRecordsTimes;
}
// Interface for props of keys in TemplePlayerRecords
export interface PlayerRecordsTimes {
  [TempleOther.SIX_HOURS]: ExpAndDate;
  [TempleOther.WEEK]: ExpAndDate;
  [TempleOther.MONTH]: ExpAndDate;
  [TempleOther.YEAR]: ExpAndDate;
}
// Interface for PlayerRecordsTimes props
export interface ExpAndDate {
  [TempleOther.XP]: string | number;
  [TempleOther.DATE_LOWERCASE]: string;
}
// Interface for TempleOSRS player stats
export interface TemplePlayerStats extends Osrs<number> {
  [TempleOther.INFO]: {
    [TempleOther.USERNAME]: string;
    [TempleOther.COUNTRY]: string;
    [TempleOther.GAME_MODE]: TempleGameMode;
    [TempleOther.CB3]: number;
    [TempleOther.F2P]: number;
    [TempleOther.BANNED]: number;
    [TempleOther.DISQUALIFIED]: number;
    [TempleOther.CLAN_PREF]: null | string;
    [TempleOther.LAST_CHECKED]: string;
    [TempleOther.LAST_CHANGED]: string;
  };
  [TempleOther.DATE]: string;
  [TempleOther.EHP]: number;
  [TempleOther.IM_EHP_CAPITAL]: number;
  [TempleOther.LVL3_EHP]: number;
  [TempleOther.F2P_EHP]: number;
  [TempleOther.EHB]: number;
  [TempleOther.IM_EHB]: number;
}
// TempleOSRS player names interface
export interface TemplePlayerNames {
  [TempleOther.ALIASES]: {
    [key: string]: {
      [TempleOther.NAME]: string;
      [TempleOther.LAST_USED]: string;
      [TempleOther.LAST_USED_SECONDS]: number;
      [TempleOther.EHP_GAINED]: number;
      [TempleOther.TIME_USED]: number;
    };
  };
  [TempleOther.HISTORY]: PlayerHistory[];
  [TempleOther.INFO]: {
    [TempleOther.HISTORY_SECONDS]: number;
  };
}
// Props for history key on TemplePlayerNames
interface PlayerHistory {
  [TempleOther.NAME]: string;
  [TempleOther.LATS_DATE]: string;
  [TempleOther.FIRST_DATE]: string;
  [TempleOther.SECONDS]: number;
  [TempleOther.EHP_LOWERCASE]: number;
  [TempleOther.XP]: number;
}
// OSRS API Object
export interface OsrsPlayer extends Osrs<OsrsSkill | BossOrMinigame> {
  [Skills.TOTAL]: OsrsSkill;
  [Skills.ATT]: OsrsSkill;
  [Skills.DEF]: OsrsSkill;
  [Skills.STR]: OsrsSkill;
  [Skills.HP]: OsrsSkill;
  [Skills.RANGED]: OsrsSkill;
  [Skills.PRAY]: OsrsSkill;
  [Skills.MAGIC]: OsrsSkill;
  [Skills.COOK]: OsrsSkill;
  [Skills.WC]: OsrsSkill;
  [Skills.FLETCH]: OsrsSkill;
  [Skills.FISH]: OsrsSkill;
  [Skills.FM]: OsrsSkill;
  [Skills.CRAFT]: OsrsSkill;
  [Skills.SMITH]: OsrsSkill;
  [Skills.MINING]: OsrsSkill;
  [Skills.HERB]: OsrsSkill;
  [Skills.AGIL]: OsrsSkill;
  [Skills.THIEV]: OsrsSkill;
  [Skills.SLAYER]: OsrsSkill;
  [Skills.FARM]: OsrsSkill;
  [Skills.RC]: OsrsSkill;
  [Skills.HUNT]: OsrsSkill;
  [Skills.CON]: OsrsSkill;
  [OsrsOther.LEAGUE]: BossOrMinigame;
  [OsrsOther.BH_HUNTER]: BossOrMinigame;
  [OsrsOther.BH_ROGUE]: BossOrMinigame;
  [Clues.ALL]: BossOrMinigame;
  [Clues.BEGINNER]: BossOrMinigame;
  [Clues.EASY]: BossOrMinigame;
  [Clues.MEDIUM]: BossOrMinigame;
  [Clues.HARD]: BossOrMinigame;
  [Clues.ELITE]: BossOrMinigame;
  [Clues.MASTER]: BossOrMinigame;
  [TempleOther.LMS]: BossOrMinigame;
  [OsrsOther.SOULWARS]: BossOrMinigame;
  [Bosses.SIRE]: BossOrMinigame;
  [Bosses.HYDRA]: BossOrMinigame;
  [Bosses.BARROWS]: BossOrMinigame;
  [Bosses.BRYOPHYTA]: BossOrMinigame;
  [Bosses.CALLISTO]: BossOrMinigame;
  [Bosses.CERBERUS]: BossOrMinigame;
  [Bosses.COX]: BossOrMinigame;
  [Bosses.COXCM]: BossOrMinigame;
  [Bosses.CHAOS_ELE]: BossOrMinigame;
  [Bosses.CHAOS_FANATIC]: BossOrMinigame;
  [Bosses.ZILYANA]: BossOrMinigame;
  [Bosses.CORP]: BossOrMinigame;
  [Bosses.CRAZY_ARCH]: BossOrMinigame;
  [Bosses.PRIME]: BossOrMinigame;
  [Bosses.REX]: BossOrMinigame;
  [Bosses.SUPREME]: BossOrMinigame;
  [Bosses.DER_ARCH]: BossOrMinigame;
  [Bosses.GRAARDOR]: BossOrMinigame;
  [Bosses.MOLE]: BossOrMinigame;
  [Bosses.GUARDIANS]: BossOrMinigame;
  [Bosses.HESPORI]: BossOrMinigame;
  [Bosses.KQ]: BossOrMinigame;
  [Bosses.KBD]: BossOrMinigame;
  [Bosses.KRAKEN]: BossOrMinigame;
  [Bosses.KREE]: BossOrMinigame;
  [Bosses.KRIL]: BossOrMinigame;
  [Bosses.MIMIC]: BossOrMinigame;
  [Bosses.NIGHTMARE]: BossOrMinigame;
  [Bosses.OBOR]: BossOrMinigame;
  [Bosses.SARACHNIS]: BossOrMinigame;
  [Bosses.SCORPIA]: BossOrMinigame;
  [Bosses.SKOTIZO]: BossOrMinigame;
  [Bosses.TEMPO]: BossOrMinigame;
  [Bosses.GAUNTLET]: BossOrMinigame;
  [Bosses.CORR_GAUNTLET]: BossOrMinigame;
  [Bosses.TOB]: BossOrMinigame;
  [Bosses.THERMY]: BossOrMinigame;
  [Bosses.ZUK]: BossOrMinigame;
  [Bosses.JAD]: BossOrMinigame;
  [Bosses.VENE]: BossOrMinigame;
  [Bosses.VETION]: BossOrMinigame;
  [Bosses.VORKATH]: BossOrMinigame;
  [Bosses.WT]: BossOrMinigame;
  [Bosses.ZALCANO]: BossOrMinigame;
  [Bosses.ZULRAH]: BossOrMinigame;
}
// Props for OSRS skill fields
export interface OsrsSkill {
  [TempleOther.RANK]: number | string;
  [TempleOther.LEVEL]: number | string;
  [TempleOther.EXP]: number | string;
}
// Props for OSRS boss and minigame fields
export interface BossOrMinigame {
  [TempleOther.RANK]: number | string;
  [TempleOther.SCORE]: number | string;
}

// General OSRS interface
export interface Osrs<T> {
  [Skills.TOTAL]: T;
  [Skills.ATT]: T;
  [Skills.DEF]: T;
  [Skills.STR]: T;
  [Skills.HP]: T;
  [Skills.RANGED]: T;
  [Skills.PRAY]: T;
  [Skills.MAGIC]: T;
  [Skills.COOK]: T;
  [Skills.WC]: T;
  [Skills.FLETCH]: T;
  [Skills.FISH]: T;
  [Skills.FM]: T;
  [Skills.CRAFT]: T;
  [Skills.SMITH]: T;
  [Skills.MINING]: T;
  [Skills.HERB]: T;
  [Skills.AGIL]: T;
  [Skills.THIEV]: T;
  [Skills.SLAYER]: T;
  [Skills.FARM]: T;
  [Skills.RC]: T;
  [Skills.HUNT]: T;
  [Skills.CON]: T;
  [Clues.ALL]: T;
  [Clues.BEGINNER]: T;
  [Clues.EASY]: T;
  [Clues.MEDIUM]: T;
  [Clues.HARD]: T;
  [Clues.ELITE]: T;
  [Clues.MASTER]: T;
  [Bosses.SIRE]: T;
  [Bosses.HYDRA]: T;
  [Bosses.BARROWS]: T;
  [Bosses.BRYOPHYTA]: T;
  [Bosses.CALLISTO]: T;
  [Bosses.CERBERUS]: T;
  [Bosses.COX]: T;
  [Bosses.COXCM]: T;
  [Bosses.CHAOS_ELE]: T;
  [Bosses.CHAOS_FANATIC]: T;
  [Bosses.ZILYANA]: T;
  [Bosses.CORP]: T;
  [Bosses.CRAZY_ARCH]: T;
  [Bosses.PRIME]: T;
  [Bosses.REX]: T;
  [Bosses.SUPREME]: T;
  [Bosses.DER_ARCH]: T;
  [Bosses.GRAARDOR]: T;
  [Bosses.MOLE]: T;
  [Bosses.GUARDIANS]: T;
  [Bosses.HESPORI]: T;
  [Bosses.KQ]: T;
  [Bosses.KBD]: T;
  [Bosses.KRAKEN]: T;
  [Bosses.KREE]: T;
  [Bosses.KRIL]: T;
  [Bosses.MIMIC]: T;
  [Bosses.NIGHTMARE]: T;
  [Bosses.OBOR]: T;
  [Bosses.SARACHNIS]: T;
  [Bosses.SCORPIA]: T;
  [Bosses.SKOTIZO]: T;
  [Bosses.TEMPO]: T;
  [Bosses.GAUNTLET]: T;
  [Bosses.CORR_GAUNTLET]: T;
  [Bosses.TOB]: T;
  [Bosses.THERMY]: T;
  [Bosses.ZUK]: T;
  [Bosses.JAD]: T;
  [Bosses.VENE]: T;
  [Bosses.VETION]: T;
  [Bosses.VORKATH]: T;
  [Bosses.WT]: T;
  [Bosses.ZALCANO]: T;
  [Bosses.ZULRAH]: T;
  [TempleOther.LMS]: T;
}
