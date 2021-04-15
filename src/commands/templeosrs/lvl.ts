import { Message } from 'discord.js';
import { playerStats, fetchTemple, PlayerStats } from '../../cache/templeCache';
import { TempleEmbed } from '../../utils/embed';
import { templeDateParser } from '../../utils/osrs/templeDateParser';
import { runescapeNameValidator } from '../../utils/osrs/runescapeNameValidator';
import { argsWithPrefixToString } from '../../utils/argsToString';
import { isPrefixValid, Categories } from '../../utils/osrs/isPrefixValid';
import { osrsLevelCalculator } from '../../utils/osrs/levelCalculator';
import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: 'config.env' });
const HISCORE_API: string = process.env.OSRS_HISCORE_API as string;

export const lvl = async (
  msg: Message,
  ...args: string[]
): Promise<Message | undefined> => {
  const prefix: string | null = isPrefixValid(
    msg,
    args,
    skillList,
    Categories.SKILL
  );
  if (prefix === null) return;
  const usernameWithoutSpaces: string = args.slice(1).join('');
  const nameCheck: boolean = runescapeNameValidator(usernameWithoutSpaces);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const usernameWithSpaces: string = argsWithPrefixToString(...args);
  const embed: TempleEmbed = new TempleEmbed()
    .setTitle('Lvl')
    .addField('Username', `${usernameWithSpaces}`);
  if (usernameWithSpaces in playerStats) {
    const result = await generateResult(
      prefix,
      embed,
      playerStats[usernameWithSpaces]
    );
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchTemple(msg, usernameWithSpaces);
    if (isFetched === true) {
      const result = await generateResult(
        prefix,
        embed,
        playerStats[usernameWithSpaces]
      );
      return msg.channel.send(result);
    } else return;
  }
};

// Generates embed sent to user
const generateResult = async (
  inputPrefix: string,
  inputEmbed: TempleEmbed,
  playerObject: PlayerStats
): Promise<TempleEmbed> => {
  const prefix: string = inputPrefix;
  const embed: TempleEmbed = inputEmbed;
  const player: PlayerStats = playerObject;
  const lastChecked: { title: string; time: string } = templeDateParser(
    player.info['Last checked']
  );
  embed.addField(`${lastChecked.title}`, `${lastChecked.time}`);
  const skill: { skillExp: number; skillName: string } = skillTypeCheck(
    prefix,
    player
  );
  // Intl is how I format number to have commas
  const playerName = player.info.Username.toLowerCase();
  const formatter = new Intl.NumberFormat('en-US');
  const formattedExp = formatter.format(skill.skillExp);
  let level: string | undefined;

  // Unfortunately if player is unranked, their level will be undefined and calculating total level from this is impossible, so I have to fetch the OSRS database. Why not fetch everything from OSRS database in the first place? Well, I started this project with using Temple OSRS API in mind so I might as well stick with it. Also some data from temple is not available on OSRS highscores
  if (skill.skillName === Skills.TOTAL) {
    const res: AxiosResponse = await axios.get(`${HISCORE_API}${playerName}`);
    if (res.status === 200) level = res.data.split(',')[1];
    else level = 'Unknown';
  } else {
    const calc: string | undefined = osrsLevelCalculator(skill.skillExp);
    if (calc === undefined) level = 'Unranked';
    else level = calc;
  }
  embed.addField(`${skill.skillName} lvl`, `${level}`);
  // Temple returns unranked exp as - 1
  if (formattedExp === '-1') embed.addField('Experience', `Unranked`);
  else embed.addField('Experience', `${formattedExp} exp`);
  return embed;
};

const skillTypeCheck = (
  prefix: string,
  playerObject: PlayerStats
): { skillExp: number; skillName: string } => {
  const type: string = prefix;
  const playerStats = playerObject;
  let skillExp: number;
  let skillName: string;
  switch (type) {
    case 'total':
      skillExp = playerStats[Skills.TOTAL];
      skillName = Skills.TOTAL;
      break;
    case 'overall':
      skillExp = playerStats[Skills.TOTAL];
      skillName = Skills.TOTAL;
      break;
    case 'attack':
      skillExp = playerStats[Skills.ATT];
      skillName = Skills.ATT;
      break;
    case 'att':
      skillExp = playerStats[Skills.ATT];
      skillName = Skills.ATT;
      break;
    case 'defence':
      skillExp = playerStats[Skills.DEF];
      skillName = Skills.DEF;
      break;
    case 'def':
      skillExp = playerStats[Skills.DEF];
      skillName = Skills.DEF;
      break;
    case 'strength':
      skillExp = playerStats[Skills.STR];
      skillName = Skills.STR;
      break;
    case 'str':
      skillExp = playerStats[Skills.STR];
      skillName = Skills.STR;
      break;
    case 'hitpoints':
      skillExp = playerStats[Skills.HP];
      skillName = Skills.HP;
      break;
    case 'hp':
      skillExp = playerStats[Skills.HP];
      skillName = Skills.HP;
      break;
    case 'ranged':
      skillExp = playerStats[Skills.RANGED];
      skillName = Skills.RANGED;
      break;
    case 'range':
      skillExp = playerStats[Skills.RANGED];
      skillName = Skills.RANGED;
      break;
    case 'prayer':
      skillExp = playerStats[Skills.PRAY];
      skillName = Skills.PRAY;
      break;
    case 'pray':
      skillExp = playerStats[Skills.PRAY];
      skillName = Skills.PRAY;
      break;
    case 'magic':
      skillExp = playerStats[Skills.MAGIC];
      skillName = Skills.MAGIC;
      break;
    case 'mage':
      skillExp = playerStats[Skills.MAGIC];
      skillName = Skills.MAGIC;
      break;
    case 'cooking':
      skillExp = playerStats[Skills.COOK];
      skillName = Skills.COOK;
      break;
    case 'cook':
      skillExp = playerStats[Skills.COOK];
      skillName = Skills.COOK;
      break;
    case 'woodcutting':
      skillExp = playerStats[Skills.WC];
      skillName = Skills.WC;
      break;
    case 'wc':
      skillExp = playerStats[Skills.WC];
      skillName = Skills.WC;
      break;
    case 'fletching':
      skillExp = playerStats[Skills.FLETCH];
      skillName = Skills.FLETCH;
      break;
    case 'fletch':
      skillExp = playerStats[Skills.FLETCH];
      skillName = Skills.FLETCH;
      break;
    case 'fishing':
      skillExp = playerStats[Skills.FISH];
      skillName = Skills.FISH;
      break;
    case 'fish':
      skillExp = playerStats[Skills.FISH];
      skillName = Skills.FISH;
      break;
    case 'firemaking':
      skillExp = playerStats[Skills.FM];
      skillName = Skills.FM;
      break;
    case 'firemake':
      skillExp = playerStats[Skills.FM];
      skillName = Skills.FM;
      break;
    case 'fm':
      skillExp = playerStats[Skills.FM];
      skillName = Skills.FM;
      break;
    case 'crafting':
      skillExp = playerStats[Skills.CRAFT];
      skillName = Skills.CRAFT;
      break;
    case 'craft':
      skillExp = playerStats[Skills.CRAFT];
      skillName = Skills.CRAFT;
      break;
    case 'smithing':
      skillExp = playerStats[Skills.SMITH];
      skillName = Skills.SMITH;
      break;
    case 'smith':
      skillExp = playerStats[Skills.SMITH];
      skillName = Skills.SMITH;
      break;
    case 'mining':
      skillExp = playerStats[Skills.MINING];
      skillName = Skills.MINING;
      break;
    case 'mine':
      skillExp = playerStats[Skills.MINING];
      skillName = Skills.MINING;
      break;
    case 'herblore':
      skillExp = playerStats[Skills.HERB];
      skillName = Skills.HERB;
      break;
    case 'herb':
      skillExp = playerStats[Skills.HERB];
      skillName = Skills.HERB;
      break;
    case 'agility':
      skillExp = playerStats[Skills.AGIL];
      skillName = Skills.AGIL;
      break;
    case 'agil':
      skillExp = playerStats[Skills.AGIL];
      skillName = Skills.AGIL;
      break;
    case 'thieving':
      skillExp = playerStats[Skills.THIEV];
      skillName = Skills.THIEV;
      break;
    case 'thiev':
      skillExp = playerStats[Skills.THIEV];
      skillName = Skills.THIEV;
      break;
    case 'slayer':
      skillExp = playerStats[Skills.SLAYER];
      skillName = Skills.SLAYER;
      break;
    case 'slay':
      skillExp = playerStats[Skills.SLAYER];
      skillName = Skills.SLAYER;
      break;
    case 'farming':
      skillExp = playerStats[Skills.FARM];
      skillName = Skills.FARM;
      break;
    case 'farm':
      skillExp = playerStats[Skills.FARM];
      skillName = Skills.FARM;
      break;
    case 'runecrafting':
      skillExp = playerStats[Skills.RC];
      skillName = Skills.RC;
      break;
    case 'runecraft':
      skillExp = playerStats[Skills.RC];
      skillName = Skills.RC;
      break;
    case 'rc':
      skillExp = playerStats[Skills.RC];
      skillName = Skills.RC;
      break;
    case 'hunter':
      skillExp = playerStats[Skills.HUNT];
      skillName = Skills.HUNT;
      break;
    case 'hunt':
      skillExp = playerStats[Skills.HUNT];
      skillName = Skills.HUNT;
      break;
    case 'construction':
      skillExp = playerStats[Skills.CON];
      skillName = Skills.CON;
      break;
    case 'con':
      skillExp = playerStats[Skills.CON];
      skillName = Skills.CON;
      break;
    case 'const':
      skillExp = playerStats[Skills.CON];
      skillName = Skills.CON;
      break;

    default:
      skillExp = 0;
      skillName = '';
  }
  return {
    skillExp,
    skillName,
  };
};

// SKill names
export enum Skills {
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

const skillList: string[] = [
  'total',
  'overall',
  'attack',
  'att',
  'defence',
  'def',
  'strength',
  'str',
  'hitpoints',
  'hp',
  'ranged',
  'range',
  'prayer',
  'pray',
  'magic',
  'mage',
  'cooking',
  'cook',
  'woodcutting',
  'wc',
  'fletching',
  'fletch',
  'fishing',
  'fish',
  'firemaking',
  'firemake',
  'fm',
  'crafting',
  'craft',
  'smithing',
  'smith',
  'mining',
  'mine',
  'herblore',
  'herb',
  'agility',
  'agil',
  'thieving',
  'thiev',
  'slayer',
  'slay',
  'farming',
  'farm',
  'runecrafting',
  'runecraft',
  'rc',
  'hunter',
  'hunt',
  'construction',
  'const',
  'con',
];
