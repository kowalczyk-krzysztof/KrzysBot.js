import { Message } from 'discord.js';
import { playerStats, fetchTemple, PlayerStats } from '../../cache/templeCache';
import { TempleEmbed } from '../../utils/embed';
import { templeDateParser } from '../../utils/osrs/templeDateParser';
import { runescapeNameValidator } from '../../utils/osrs/runescapeNameValidator';
import { argsWithPrefixToString } from '../../utils/argsToString';
import { isPrefixValid } from '../../utils/osrs/isPrefixValid';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

// SKill names
enum Skills {
  TOTAL = 'Overall',
  ATT = 'Attack',
  DEF = 'Defence',
  STR = 'Strength',
  HP = 'Hitpoints',
  RANGED = 'Ranged',
  PRAY = 'Prayer',
  MAGIC = 'Magic',
  COOK = 'Cooking',
  WC = 'Woodcutting',
  FLETCH = 'Fletching',
  FISH = 'Fishing',
  FM = 'Firemaking',
  CRAFT = 'Crafting',
  SMITH = 'Smithing',
  MINING = 'Mining',
  HERB = 'Herblore',
  AGIL = 'Agility',
  THIEV = 'Thieving',
  SLAYER = 'Slayer',
  FARM = 'Farming',
  RC = 'Runecraft',
  HUNT = 'Hunter',
  CON = 'Construction',
}

const skillTypeCheck = (prefix: string, playerObject: PlayerStats): number => {
  const type: string = prefix;
  const playerStats = playerObject;
  let skillExp: number;
  // else return 0;
  switch (type) {
    case 'total':
      skillExp = playerStats[Skills.TOTAL];
      break;
    case 'overall':
      skillExp = playerStats[Skills.TOTAL];
      break;
    case 'attack':
      skillExp = playerStats[Skills.ATT];
      break;
    case 'att':
      skillExp = playerStats[Skills.ATT];
      break;
    case 'defence':
      skillExp = playerStats[Skills.DEF];
      break;
    case 'def':
      skillExp = playerStats[Skills.DEF];
      break;
    case 'strength':
      skillExp = playerStats[Skills.STR];
      break;
    case 'str':
      skillExp = playerStats[Skills.STR];
      break;
    case 'hitpoints':
      skillExp = playerStats[Skills.HP];
      break;
    case 'hp':
      skillExp = playerStats[Skills.HP];
      break;
    case 'ranged':
      skillExp = playerStats[Skills.RANGED];
      break;
    case 'range':
      skillExp = playerStats[Skills.RANGED];
      break;
    case 'prayer':
      skillExp = playerStats[Skills.PRAY];
      break;
    case 'pray':
      skillExp = playerStats[Skills.PRAY];
      break;
    case 'magic':
      skillExp = playerStats[Skills.MAGIC];
      break;
    case 'mage':
      skillExp = playerStats[Skills.MAGIC];
      break;
    case 'cooking':
      skillExp = playerStats[Skills.COOK];
      break;
    case 'cook':
      skillExp = playerStats[Skills.COOK];
      break;
    case 'cook':
      skillExp = playerStats[Skills.COOK];
      break;
    case 'woodcutting':
      skillExp = playerStats[Skills.WC];
      break;
    case 'wc':
      skillExp = playerStats[Skills.WC];
      break;
    case 'fletching':
      skillExp = playerStats[Skills.FLETCH];
      break;
    case 'fletch':
      skillExp = playerStats[Skills.FLETCH];
      break;
    case 'fishing':
      skillExp = playerStats[Skills.FISH];
      break;
    case 'fish':
      skillExp = playerStats[Skills.FISH];
      break;
    case 'firemaking':
      skillExp = playerStats[Skills.FM];
      break;
    case 'firemake':
      skillExp = playerStats[Skills.FM];
      break;
    case 'fm':
      skillExp = playerStats[Skills.FM];
      break;
    case 'crafting':
      skillExp = playerStats[Skills.CRAFT];
      break;
    case 'craft':
      skillExp = playerStats[Skills.CRAFT];
      break;
    case 'smithing':
      skillExp = playerStats[Skills.SMITH];
      break;
    case 'smith':
      skillExp = playerStats[Skills.SMITH];
      break;
    case 'mining':
      skillExp = playerStats[Skills.MINING];
      break;
    case 'mine':
      skillExp = playerStats[Skills.MINING];
      break;
    case 'herblore':
      skillExp = playerStats[Skills.HERB];
      break;
    case 'herb':
      skillExp = playerStats[Skills.HERB];
      break;
    case 'agility':
      skillExp = playerStats[Skills.AGIL];
      break;
    case 'agil':
      skillExp = playerStats[Skills.AGIL];
      break;
    case 'thieving':
      skillExp = playerStats[Skills.THIEV];
      break;
    case 'thiev':
      skillExp = playerStats[Skills.THIEV];
      break;
    case 'slayer':
      skillExp = playerStats[Skills.SLAYER];
      break;
    case 'slay':
      skillExp = playerStats[Skills.SLAYER];
      break;
    case 'farming':
      skillExp = playerStats[Skills.FARM];
      break;
    case 'farm':
      skillExp = playerStats[Skills.FARM];
      break;
    case 'runecrafting':
      skillExp = playerStats[Skills.RC];
      break;
    case 'runecraft':
      skillExp = playerStats[Skills.RC];
      break;
    case 'rc':
      skillExp = playerStats[Skills.RC];
      break;
    case 'hunter':
      skillExp = playerStats[Skills.HUNT];
      break;
    case 'hunt':
      skillExp = playerStats[Skills.HUNT];
      break;
    case 'construction':
      skillExp = playerStats[Skills.CON];
      break;
    case 'con':
      skillExp = playerStats[Skills.CON];
      break;
    case 'const':
      skillExp = playerStats[Skills.CON];
      break;

    default:
      skillExp = 0;
  }
  return skillExp;
};
