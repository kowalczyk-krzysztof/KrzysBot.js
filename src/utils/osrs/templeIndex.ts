// UTILS: Enums
import { Bosses, TempleIndex, Skills, SkillAliases } from './enums';

// Index to boss
export const indexToBoss = (nr: number): string | undefined => {
  let boss: string;
  switch (nr) {
    case TempleIndex.SIRE:
      boss = Bosses.SIRE;
      break;
    case TempleIndex.HYDRA:
      boss = Bosses.HYDRA;
      break;
    case TempleIndex.BARROWS:
      boss = Bosses.BARROWS;
      break;
    case TempleIndex.BRYOPHYTA:
      boss = Bosses.BRYOPHYTA;
      break;
    case TempleIndex.CALLISTO:
      boss = Bosses.CALLISTO;
      break;
    case TempleIndex.CERBERUS:
      boss = Bosses.CERBERUS;
      break;
    case TempleIndex.COX:
      boss = Bosses.COX;
      break;
    case TempleIndex.COXCM:
      boss = Bosses.COXCM;
      break;
    case TempleIndex.CHAOS_ELE:
      boss = Bosses.CHAOS_ELE;
      break;
    case TempleIndex.CHAOS_FANATIC:
      boss = Bosses.CHAOS_FANATIC;
      break;
    case TempleIndex.ZILYANA:
      boss = Bosses.ZILYANA;
      break;
    case TempleIndex.CORP:
      boss = Bosses.CORP;
      break;
    case TempleIndex.CRAZY_ARCH:
      boss = Bosses.CRAZY_ARCH;
      break;
    case TempleIndex.PRIME:
      boss = Bosses.PRIME;
      break;
    case TempleIndex.REX:
      boss = Bosses.REX;
      break;
    case TempleIndex.SUPREME:
      boss = Bosses.SUPREME;
      break;
    case TempleIndex.DER_ARCH:
      boss = Bosses.DER_ARCH;
      break;
    case TempleIndex.GRAARDOR:
      boss = Bosses.GRAARDOR;
      break;
    case TempleIndex.MOLE:
      boss = Bosses.MOLE;
      break;
    case TempleIndex.GUARDIANS:
      boss = Bosses.GUARDIANS;
      break;
    case TempleIndex.HESPORI:
      boss = Bosses.GUARDIANS;
      break;
    case TempleIndex.KQ:
      boss = Bosses.KQ;
      break;
    case TempleIndex.KBD:
      boss = Bosses.KBD;
      break;
    case TempleIndex.KRAKEN:
      boss = Bosses.KRAKEN;
      break;
    case TempleIndex.KREE:
      boss = Bosses.KREE;
      break;
    case TempleIndex.KRIL:
      boss = Bosses.KRIL;
      break;
    case TempleIndex.MIMIC:
      boss = Bosses.MIMIC;
      break;
    case TempleIndex.NIGHTMARE:
      boss = Bosses.NIGHTMARE;
      break;
    case TempleIndex.OBOR:
      boss = Bosses.OBOR;
      break;
    case TempleIndex.SARACHNIS:
      boss = Bosses.SARACHNIS;
      break;
    case TempleIndex.SCORPIA:
      boss = Bosses.SCORPIA;
      break;
    case TempleIndex.SKOTIZO:
      boss = Bosses.SKOTIZO;
      break;
    case TempleIndex.GAUNTLET:
      boss = Bosses.GAUNTLET;
      break;
    case TempleIndex.CORR_GAUNTLET:
      boss = Bosses.CORR_GAUNTLET;
      break;
    case TempleIndex.TOB:
      boss = Bosses.TOB;
      break;
    case TempleIndex.THERMY:
      boss = Bosses.THERMY;
      break;
    case TempleIndex.ZUK:
      boss = Bosses.ZUK;
      break;
    case TempleIndex.JAD:
      boss = Bosses.JAD;
      break;
    case TempleIndex.VENE:
      boss = Bosses.VENE;
      break;
    case TempleIndex.VETION:
      boss = Bosses.VETION;
      break;
    case TempleIndex.VORKATH:
      boss = Bosses.VORKATH;
      break;
    case TempleIndex.WT:
      boss = Bosses.WT;
      break;
    case TempleIndex.ZALCANO:
      boss = Bosses.ZALCANO;
      break;
    case TempleIndex.ZULRAH:
      boss = Bosses.ZULRAH;
      break;
    default:
      return;
  }
  return boss;
};

export const indexToSkill = (nr: number): string | undefined => {
  let skill: string;
  switch (nr) {
    case TempleIndex.TOTAL:
      skill = Skills.TOTAL;
      break;
    case TempleIndex.ATT:
      skill = Skills.ATT;
      break;
    case TempleIndex.DEF:
      skill = Skills.DEF;
      break;
    case TempleIndex.STR:
      skill = Skills.STR;
      break;
    case TempleIndex.HP:
      skill = Skills.HP;
      break;
    case TempleIndex.RANGED:
      skill = Skills.RANGED;
      break;
    case TempleIndex.PRAY:
      skill = Skills.PRAY;
      break;
    case TempleIndex.MAGIC:
      skill = Skills.MAGIC;
      break;
    case TempleIndex.COOK:
      skill = Skills.COOK;
      break;
    case TempleIndex.WC:
      skill = Skills.WC;
      break;
    case TempleIndex.FLETCH:
      skill = Skills.FLETCH;
      break;
    case TempleIndex.FISH:
      skill = Skills.FISH;
      break;
    case TempleIndex.FM:
      skill = Skills.FM;
      break;
    case TempleIndex.CRAFT:
      skill = Skills.CRAFT;
      break;
    case TempleIndex.SMITH:
      skill = Skills.SMITH;
      break;
    case TempleIndex.MINING:
      skill = Skills.MINING;
      break;
    case TempleIndex.HERB:
      skill = Skills.HERB;
      break;
    case TempleIndex.AGIL:
      skill = Skills.AGIL;
      break;
    case TempleIndex.THIEV:
      skill = Skills.THIEV;
      break;
    case TempleIndex.SLAYER:
      skill = Skills.SLAYER;
      break;
    case TempleIndex.FARM:
      skill = Skills.FARM;
      break;
    case TempleIndex.RC:
      skill = Skills.RC;
      break;
    case TempleIndex.HUNT:
      skill = Skills.HUNT;
      break;
    case TempleIndex.CON:
      skill = Skills.CON;
      break;
    default:
      return;
  }
  return skill;
};

export const aliasToSkillIndex = (alias: string): number | undefined => {
  let skill: number;
  switch (alias) {
    case SkillAliases.TOTAL_ALIAS1:
      skill = TempleIndex.TOTAL;
      break;
    case SkillAliases.TOTAL_ALIAS2:
      skill = TempleIndex.TOTAL;
      break;
    case SkillAliases.ATTACK_ALIAS1:
      skill = TempleIndex.ATT;
      break;
    case SkillAliases.ATTACK_ALIAS2:
      skill = TempleIndex.ATT;
      break;
    case SkillAliases.DEFENCE_ALIAS1:
      skill = TempleIndex.DEF;
      break;
    case SkillAliases.DEFENCE_ALIAS2:
      skill = TempleIndex.DEF;
      break;
    case SkillAliases.STRENGTH_ALIAS1:
      skill = TempleIndex.STR;
      break;
    case SkillAliases.STRENGTH_ALIAS2:
      skill = TempleIndex.STR;
      break;
    case SkillAliases.HP_ALIAS1:
      skill = TempleIndex.HP;
      break;
    case SkillAliases.HP_ALIAS2:
      skill = TempleIndex.HP;
      break;
    case SkillAliases.RANGED_ALIAS1:
      skill = TempleIndex.RANGED;
      break;
    case SkillAliases.RANGED_ALIAS2:
      skill = TempleIndex.RANGED;
      break;
    case SkillAliases.PRAYER_ALIAS1:
      skill = TempleIndex.PRAY;
      break;
    case SkillAliases.PRAYER_ALIAS2:
      skill = TempleIndex.PRAY;
      break;
    case SkillAliases.MAGIC_ALIAS1:
      skill = TempleIndex.MAGIC;
      break;
    case SkillAliases.MAGIC_ALIAS2:
      skill = TempleIndex.MAGIC;
      break;
    case SkillAliases.COOKING_ALIAS1:
      skill = TempleIndex.COOK;
      break;
    case SkillAliases.COOKING_ALIAS2:
      skill = TempleIndex.COOK;
      break;
    case SkillAliases.WC_ALIAS1:
      skill = TempleIndex.WC;
      break;
    case SkillAliases.WC_ALIAS2:
      skill = TempleIndex.WC;
      break;
    case SkillAliases.FLETCH_ALIAS1:
      skill = TempleIndex.FLETCH;
      break;
    case SkillAliases.FLETCH_ALIAS2:
      skill = TempleIndex.FLETCH;
      break;
    case SkillAliases.FISH_ALIAS1:
      skill = TempleIndex.FISH;
      break;
    case SkillAliases.FISH_ALIAS2:
      skill = TempleIndex.FISH;
      break;
    case SkillAliases.FM_ALIAS1:
      skill = TempleIndex.FM;
      break;
    case SkillAliases.FM_ALIAS2:
      skill = TempleIndex.FM;
      break;
    case SkillAliases.FM_ALIAS3:
      skill = TempleIndex.FM;
      break;
    case SkillAliases.CRAFT_ALIAS1:
      skill = TempleIndex.CRAFT;
      break;
    case SkillAliases.CRAFT_ALIAS2:
      skill = TempleIndex.CRAFT;
      break;
    case SkillAliases.SMITH_ALIAS1:
      skill = TempleIndex.SMITH;
      break;
    case SkillAliases.SMITH_ALIAS2:
      skill = TempleIndex.SMITH;
      break;
    case SkillAliases.MINING_ALIAS1:
      skill = TempleIndex.MINING;
      break;
    case SkillAliases.MINING_ALIAS2:
      skill = TempleIndex.MINING;
      break;
    case SkillAliases.HERB_ALIAS1:
      skill = TempleIndex.HERB;
      break;
    case SkillAliases.HERB_ALIAS2:
      skill = TempleIndex.HERB;
      break;
    case SkillAliases.AGIL_ALIAS1:
      skill = TempleIndex.AGIL;
      break;
    case SkillAliases.AGIL_ALIAS2:
      skill = TempleIndex.AGIL;
      break;
    case SkillAliases.THIEV_ALIAS1:
      skill = TempleIndex.THIEV;
      break;
    case SkillAliases.THIEV_ALIAS2:
      skill = TempleIndex.THIEV;
      break;
    case SkillAliases.SLAY_ALIAS1:
      skill = TempleIndex.SLAYER;
      break;
    case SkillAliases.SLAY_ALIAS2:
      skill = TempleIndex.SLAYER;
      break;
    case SkillAliases.FARM_ALIAS1:
      skill = TempleIndex.FARM;
      break;
    case SkillAliases.FARM_ALIAS2:
      skill = TempleIndex.FARM;
      break;
    case SkillAliases.RC_ALIAS1:
      skill = TempleIndex.RC;
      break;
    case SkillAliases.RC_ALIAS2:
      skill = TempleIndex.RC;
      break;
    case SkillAliases.RC_ALIAS3:
      skill = TempleIndex.RC;
      break;
    case SkillAliases.HUNT_ALIAS1:
      skill = TempleIndex.HUNT;
      break;
    case SkillAliases.HUNT_ALIAS2:
      skill = TempleIndex.HUNT;
      break;
    case SkillAliases.CONSTR_ALIAS1:
      skill = TempleIndex.CON;
      break;
    case SkillAliases.CONSTR_ALIAS2:
      skill = TempleIndex.CON;
      break;
    case SkillAliases.CONSTR_ALIAS3:
      skill = TempleIndex.CON;
      break;
    case SkillAliases.CONSTR_ALIAS4:
      skill = TempleIndex.CON;
      break;
    default:
      return;
  }
  return skill;
};
