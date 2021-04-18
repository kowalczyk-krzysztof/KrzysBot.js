// Discord
import { Message } from 'discord.js';
// OSRS cache
import { fetchOsrsStats, osrsStats } from '../../cache/osrsCache';
// Cooldown cache
import { isOnCooldown } from '../../cache/cooldown';
// UTILS: Embeds
import {
  OsrsEmbed,
  EmbedTitles,
  usernameString,
  ErrorEmbed,
} from '../../utils/embed';
// UTILS: Interfaces
import { OsrsPlayer, OsrsSkill } from '../../utils/osrs/interfaces';
// UTILS: Enums
import { OsrsRandom, Skills, TempleOther } from '../../utils/osrs/enums';
// UTILS: Runescape name validator
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Prefix validator
import {
  isPrefixValid,
  Categories,
  invalidPrefix,
} from '../../utils/osrs/isPrefixValid';
// UTILS: Input validator
import { skillFields, skillList } from '../../utils/osrs/inputValidator';

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
    const field: keyof OsrsPlayer | undefined = skillFields(
      prefix
    ) as keyof OsrsPlayer;
    if (field === undefined) return;
    else {
      const result: OsrsEmbed = await generateResult(
        field,
        embed,
        osrsStats[username]
      );
      return msg.channel.send(result);
    }
  } else {
    const isFetched: boolean = await fetchOsrsStats(msg, username);
    if (isFetched === true) {
      const field: keyof OsrsPlayer | undefined = skillFields(
        prefix
      ) as keyof OsrsPlayer;
      if (field === undefined) return;
      else {
        const result: OsrsEmbed = await generateResult(
          field,
          embed,
          osrsStats[username]
        );
        return msg.channel.send(result);
      }
    } else return;
  }
};
// Generates embed sent to user
const generateResult = (
  field: keyof OsrsPlayer,
  inputEmbed: OsrsEmbed,
  playerObject: OsrsPlayer
): OsrsEmbed | ErrorEmbed => {
  // keyof is how I can index objects like that
  if (playerObject === undefined) return new ErrorEmbed();
  else {
    const skill = playerObject[field] as OsrsSkill;
    // Intl is how I format number to have commas
    const formatter: Intl.NumberFormat = new Intl.NumberFormat(
      `${OsrsRandom.DATE_FORMAT}`
    );
    let formattedExp: Intl.NumberFormat | string;
    if (typeof skill[TempleOther.EXP] === 'number')
      formattedExp = formatter.format(skill[TempleOther.EXP] as number);
    else formattedExp = skill[TempleOther.EXP] as string;
    let skillName: string;
    if (field === Skills.RC) skillName = OsrsRandom.RUNECRAFTING;
    else skillName = field;
    inputEmbed.addField(
      `${skillName} ${OsrsRandom.LVL_SHORT}`,
      `${skill[TempleOther.LEVEL]}`
    );
    inputEmbed.addField(
      `${OsrsRandom.EXP_LONG}`,
      `${formattedExp} ${TempleOther.EXP}`
    );
    return inputEmbed;
  }
};
