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
  PrefixCategories,
  invalidPrefix,
  invalidPrefixMsg,
} from '../../utils/osrs/isPrefixValid';
// UTILS: Input validator
import { skillFields, skillList } from '../../utils/osrs/inputValidator';
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';
// UTIILS : Number formatter
import {
  numberFormatter,
  NumberFormatTypes,
} from '../../utils/numberFormatter';

export const lvl = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  if (args.length === 0)
    return msg.channel.send(
      invalidPrefixMsg(skillList, PrefixCategories.SKILL)
    );
  // This is done so the cooldown is per unique command
  const lowerCasedArguments: string[] = args.map((e: string) => {
    return e.toLowerCase();
  });
  const prefix: string = isPrefixValid(
    msg,
    args,
    skillList,
    PrefixCategories.SKILL
  );
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
  if (playerObject === undefined || playerObject === null)
    return errorHandler();
  else {
    const skill = playerObject[field] as OsrsSkill;
    // Intl is how I format number to have commas
    let formattedExp: Intl.NumberFormat | string;
    if (typeof skill[TempleOther.EXP] === 'number')
      formattedExp = numberFormatter(
        skill[TempleOther.EXP],
        NumberFormatTypes.EN_US
      ) as string;
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
