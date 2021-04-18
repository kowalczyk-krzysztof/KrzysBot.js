import { Message } from 'discord.js';
import { SkillAliases, Skills, TempleOther } from '../../utils/osrs/enums';
import {
  fetchOsrsStats,
  osrsStats,
  OsrsPlayer,
  OsrsSkill,
} from '../../cache/osrsCache';
import {
  OsrsEmbed,
  EmbedTitles,
  usernameString,
  ErrorEmbed,
} from '../../utils/embed';
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
import {
  isPrefixValid,
  Categories,
  invalidPrefix,
} from '../../utils/osrs/isPrefixValid';
import { isOnCooldown } from '../../cache/cooldown';

export const lvl = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const lowerCasedArguments = args.map((e: string) => {
    return e.toLowerCase();
  });
  const prefix: string = isPrefixValid(msg, args, skillList, Categories.SKILL);
  if (prefix === invalidPrefix) return;
  const cooldown: number = 30;
  const nameCheck: string = runescapeNameValidator(args.slice(1));
  if (nameCheck === invalidRSN) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  if (
    isOnCooldown(
      msg,
      commandName,
      cooldown,
      false,
      lowerCasedArguments.join('')
    ) === true
  )
    return;
  const embed: OsrsEmbed = new OsrsEmbed()
    .setTitle(EmbedTitles.LVL)
    .addField(usernameString, `${username}`);
  if (username in osrsStats) {
    const result: OsrsEmbed = await generateResult(
      prefix,
      embed,
      osrsStats[username]
    );
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchOsrsStats(msg, username);
    if (isFetched === true) {
      const result: OsrsEmbed = await generateResult(
        prefix,
        embed,
        osrsStats[username]
      );
      return msg.channel.send(result);
    } else return;
  }
};

// Generates embed sent to user
const generateResult = (
  inputPrefix: string,
  inputEmbed: OsrsEmbed,
  playerObject: OsrsPlayer
): OsrsEmbed | ErrorEmbed => {
  if (playerObject === undefined) return new ErrorEmbed();
  const skill: {
    skillName: string;
    skillExp: OsrsSkill;
  } = skillTypeCheck(inputPrefix, playerObject);
  console.log(Object.keys(skill.skillName));
  // Intl is how I format number to have commas
  const formatter: Intl.NumberFormat = new Intl.NumberFormat('en-US');
  let formattedExp: Intl.NumberFormat | string;
  if (typeof skill.skillExp.exp === 'number')
    formattedExp = formatter.format(skill.skillExp.exp);
  else formattedExp = skill.skillExp.exp;
  let skillName: string;
  if (skill.skillName === Skills.RC) skillName = 'Runecrafting';
  else skillName = skill.skillName;
  inputEmbed.addField(
    `${skillName} lvl`,
    `${skill.skillExp[TempleOther.LEVEL]}`
  );
  inputEmbed.addField('Experience', `${formattedExp} exp`);
  return inputEmbed;
};

const skillTypeCheck = (
  prefix: string,
  playerObject: OsrsPlayer
): {
  skillName: string;
  skillExp: OsrsSkill;
} => {
  const playerStats: OsrsPlayer = playerObject;
  let skillExp: OsrsSkill;
  let skillName: string;
  switch (prefix) {
    case SkillAliases.TOTAL_ALIAS1:
      skillExp = playerStats[Skills.TOTAL];
      skillName = Skills.TOTAL;
      break;
    case SkillAliases.TOTAL_ALIAS2:
      skillExp = playerStats[Skills.TOTAL];
      skillName = Skills.TOTAL;
      break;
    case SkillAliases.ATTACK_ALIAS1:
      skillExp = playerStats[Skills.ATT];
      skillName = Skills.ATT;
      break;
    case SkillAliases.ATTACK_ALIAS2:
      skillExp = playerStats[Skills.ATT];
      skillName = Skills.ATT;
      break;
    case SkillAliases.DEFENCE_ALIAS1:
      skillExp = playerStats[Skills.DEF];
      skillName = Skills.DEF;
      break;
    case SkillAliases.DEFENCE_ALIAS2:
      skillExp = playerStats[Skills.DEF];
      skillName = Skills.DEF;
      break;
    case SkillAliases.STRENGTH_ALIAS1:
      skillExp = playerStats[Skills.STR];
      skillName = Skills.STR;
      break;
    case SkillAliases.STRENGTH_ALIAS2:
      skillExp = playerStats[Skills.STR];
      skillName = Skills.STR;
      break;
    case SkillAliases.HP_ALIAS1:
      skillExp = playerStats[Skills.HP];
      skillName = Skills.HP;
      break;
    case SkillAliases.HP_ALIAS2:
      skillExp = playerStats[Skills.HP];
      skillName = Skills.HP;
      break;
    case SkillAliases.RANGED_ALIAS1:
      skillExp = playerStats[Skills.RANGED];
      skillName = Skills.RANGED;
      break;
    case SkillAliases.RANGED_ALIAS2:
      skillExp = playerStats[Skills.RANGED];
      skillName = Skills.RANGED;
      break;
    case SkillAliases.PRAYER_ALIAS1:
      skillExp = playerStats[Skills.PRAY];
      skillName = Skills.PRAY;
      break;
    case SkillAliases.PRAYER_ALIAS2:
      skillExp = playerStats[Skills.PRAY];
      skillName = Skills.PRAY;
      break;
    case SkillAliases.MAGIC_ALIAS1:
      skillExp = playerStats[Skills.MAGIC];
      skillName = Skills.MAGIC;
      break;
    case SkillAliases.MAGIC_ALIAS2:
      skillExp = playerStats[Skills.MAGIC];
      skillName = Skills.MAGIC;
      break;
    case SkillAliases.COOKING_ALIAS1:
      skillExp = playerStats[Skills.COOK];
      skillName = Skills.COOK;
      break;
    case SkillAliases.COOKING_ALIAS2:
      skillExp = playerStats[Skills.COOK];
      skillName = Skills.COOK;
      break;
    case SkillAliases.WC_ALIAS1:
      skillExp = playerStats[Skills.WC];
      skillName = Skills.WC;
      break;
    case SkillAliases.WC_ALIAS2:
      skillExp = playerStats[Skills.WC];
      skillName = Skills.WC;
      break;
    case SkillAliases.FLETCH_ALIAS1:
      skillExp = playerStats[Skills.FLETCH];
      skillName = Skills.FLETCH;
      break;
    case SkillAliases.FLETCH_ALIAS2:
      skillExp = playerStats[Skills.FLETCH];
      skillName = Skills.FLETCH;
      break;
    case SkillAliases.FISH_ALIAS1:
      skillExp = playerStats[Skills.FISH];
      skillName = Skills.FISH;
      break;
    case SkillAliases.FISH_ALIAS2:
      skillExp = playerStats[Skills.FISH];
      skillName = Skills.FISH;
      break;
    case SkillAliases.FM_ALIAS1:
      skillExp = playerStats[Skills.FM];
      skillName = Skills.FM;
      break;
    case SkillAliases.FM_ALIAS2:
      skillExp = playerStats[Skills.FM];
      skillName = Skills.FM;
      break;
    case SkillAliases.FM_ALIAS3:
      skillExp = playerStats[Skills.FM];
      skillName = Skills.FM;
      break;
    case SkillAliases.CRAFT_ALIAS1:
      skillExp = playerStats[Skills.CRAFT];
      skillName = Skills.CRAFT;
      break;
    case SkillAliases.CONSTR_ALIAS2:
      skillExp = playerStats[Skills.CRAFT];
      skillName = Skills.CRAFT;
      break;
    case SkillAliases.SMITH_ALIAS1:
      skillExp = playerStats[Skills.SMITH];
      skillName = Skills.SMITH;
      break;
    case SkillAliases.SMITH_ALIAS2:
      skillExp = playerStats[Skills.SMITH];
      skillName = Skills.SMITH;
      break;
    case SkillAliases.MINING_ALIAS1:
      skillExp = playerStats[Skills.MINING];
      skillName = Skills.MINING;
      break;
    case SkillAliases.MINING_ALIAS2:
      skillExp = playerStats[Skills.MINING];
      skillName = Skills.MINING;
      break;
    case SkillAliases.HERB_ALIAS1:
      skillExp = playerStats[Skills.HERB];
      skillName = Skills.HERB;
      break;
    case SkillAliases.HERB_ALIAS2:
      skillExp = playerStats[Skills.HERB];
      skillName = Skills.HERB;
      break;
    case SkillAliases.AGIL_ALIAS1:
      skillExp = playerStats[Skills.AGIL];
      skillName = Skills.AGIL;
      break;
    case SkillAliases.AGIL_ALIAS2:
      skillExp = playerStats[Skills.AGIL];
      skillName = Skills.AGIL;
      break;
    case SkillAliases.THIEV_ALIAS1:
      skillExp = playerStats[Skills.THIEV];
      skillName = Skills.THIEV;
      break;
    case SkillAliases.THIEV_ALIAS2:
      skillExp = playerStats[Skills.THIEV];
      skillName = Skills.THIEV;
      break;
    case SkillAliases.SLAY_ALIAS1:
      skillExp = playerStats[Skills.SLAYER];
      skillName = Skills.SLAYER;
      break;
    case SkillAliases.SLAY_ALIAS2:
      skillExp = playerStats[Skills.SLAYER];
      skillName = Skills.SLAYER;
      break;
    case SkillAliases.FARM_ALIAS1:
      skillExp = playerStats[Skills.FARM];
      skillName = Skills.FARM;
      break;
    case SkillAliases.FARM_ALIAS2:
      skillExp = playerStats[Skills.FARM];
      skillName = Skills.FARM;
      break;
    case SkillAliases.RC_ALIAS1:
      skillExp = playerStats[Skills.RC];
      skillName = Skills.RC;
      break;
    case SkillAliases.RC_ALIAS2:
      skillExp = playerStats[Skills.RC];
      skillName = Skills.RC;
      break;
    case SkillAliases.RC_ALIAS3:
      skillExp = playerStats[Skills.RC];
      skillName = Skills.RC;
      break;
    case SkillAliases.HUNT_ALIAS1:
      skillExp = playerStats[Skills.HUNT];
      skillName = Skills.HUNT;
      break;
    case SkillAliases.HUNT_ALIAS2:
      skillExp = playerStats[Skills.HUNT];
      skillName = Skills.HUNT;
      break;
    case SkillAliases.CONSTR_ALIAS1:
      skillExp = playerStats[Skills.CON];
      skillName = Skills.CON;
      break;
    case SkillAliases.CONSTR_ALIAS2:
      skillExp = playerStats[Skills.CON];
      skillName = Skills.CON;
      break;
    case SkillAliases.CONSTR_ALIAS3:
      skillExp = playerStats[Skills.CON];
      skillName = Skills.CON;
      break;
    case SkillAliases.CONSTR_ALIAS4:
      skillExp = playerStats[Skills.CON];
      skillName = Skills.CON;
      break;
    default:
      skillExp = {
        rank: 'Unranked',
        level: 'Unranked',
        exp: 'Unranked',
      };
      skillName = '';
  }
  return {
    skillExp,
    skillName,
  };
};

export const skillList: string[] = [
  SkillAliases.TOTAL_ALIAS1,
  SkillAliases.TOTAL_ALIAS2,
  SkillAliases.ATTACK_ALIAS1,
  SkillAliases.ATTACK_ALIAS2,
  SkillAliases.DEFENCE_ALIAS1,
  SkillAliases.DEFENCE_ALIAS2,
  SkillAliases.STRENGTH_ALIAS1,
  SkillAliases.STRENGTH_ALIAS2,
  SkillAliases.HP_ALIAS1,
  SkillAliases.HP_ALIAS2,
  SkillAliases.RANGED_ALIAS1,
  SkillAliases.RANGED_ALIAS2,
  SkillAliases.PRAYER_ALIAS1,
  SkillAliases.PRAYER_ALIAS2,
  SkillAliases.MAGIC_ALIAS1,
  SkillAliases.MAGIC_ALIAS2,
  SkillAliases.COOKING_ALIAS1,
  SkillAliases.COOKING_ALIAS2,
  SkillAliases.WC_ALIAS1,
  SkillAliases.WC_ALIAS2,
  SkillAliases.FLETCH_ALIAS1,
  SkillAliases.FLETCH_ALIAS2,
  SkillAliases.FISH_ALIAS1,
  SkillAliases.FISH_ALIAS2,
  SkillAliases.FM_ALIAS1,
  SkillAliases.FM_ALIAS2,
  SkillAliases.FM_ALIAS3,
  SkillAliases.CRAFT_ALIAS1,
  SkillAliases.CONSTR_ALIAS2,
  SkillAliases.SMITH_ALIAS1,
  SkillAliases.SMITH_ALIAS2,
  SkillAliases.MINING_ALIAS1,
  SkillAliases.MINING_ALIAS2,
  SkillAliases.HERB_ALIAS1,
  SkillAliases.HERB_ALIAS2,
  SkillAliases.AGIL_ALIAS1,
  SkillAliases.AGIL_ALIAS2,
  SkillAliases.THIEV_ALIAS1,
  SkillAliases.THIEV_ALIAS2,
  SkillAliases.SLAY_ALIAS1,
  SkillAliases.SLAY_ALIAS2,
  SkillAliases.FARM_ALIAS1,
  SkillAliases.FARM_ALIAS2,
  SkillAliases.RC_ALIAS1,
  SkillAliases.RC_ALIAS2,
  SkillAliases.RC_ALIAS3,
  SkillAliases.HUNT_ALIAS1,
  SkillAliases.HUNT_ALIAS2,
  SkillAliases.CONSTR_ALIAS1,
  SkillAliases.CONSTR_ALIAS2,
  SkillAliases.CONSTR_ALIAS3,
  SkillAliases.CONSTR_ALIAS4,
];
