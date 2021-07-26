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
import {
  CommandCooldowns,
  OsrsRandom,
  Skills,
  TempleOther,
} from '../../utils/osrs/enums';
// UTILS: Runescape name validator
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Prefix validator
import {
  isPrefixValid,
  PrefixCategories,
} from '../../utils/osrs/isPrefixValid';
// UTILS: Input validator
import { skillFields, skillList } from '../../utils/osrs/inputValidator';
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';
// UTILS : Number formatter
import {
  numberFormatter,
  NumberFormatTypes,
} from '../../utils/numberFormatter';
// Anti-spam
import { isSpamming } from '../../cache/antiSpam';

export const lvl = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  if (isSpamming(msg, commandName)) return;
  const prefix: string | undefined = isPrefixValid(
    msg,
    args,
    skillList,
    PrefixCategories.SKILL
  );
  if (!prefix) return;
  // This is done so the cooldown is per unique command
  const lowerCasedArguments: string[] = args.map((e: string) => {
    return e.toLowerCase();
  });
  const cooldown: number = CommandCooldowns.LVL;
  const username: string | undefined = runescapeNameValidator(args.slice(1));
  if (!username) return msg.channel.send(invalidUsername);
  if (
    isOnCooldown(
      msg,
      commandName,
      cooldown,
      false,
      lowerCasedArguments.join('')
    )
  )
    return;
  const embed: OsrsEmbed = new OsrsEmbed()
    .setTitle(EmbedTitles.LVL)
    .addField(usernameString, `\`\`\`${username}\`\`\``);
  if (username in osrsStats) {
    const field: keyof OsrsPlayer | undefined = skillFields(
      prefix
    ) as keyof OsrsPlayer;
    if (!field) return;

    const result: OsrsEmbed = await generateResult(
      embed,
      osrsStats[username],
      field
    );
    return msg.channel.send(result);
  }
  const isFetched: boolean = await fetchOsrsStats(msg, username);
  if (isFetched) {
    const field: keyof OsrsPlayer | undefined = skillFields(
      prefix
    ) as keyof OsrsPlayer;
    if (!field) return;
    return msg.channel.send(generateResult(embed, osrsStats[username], field));
  }
  return;
};
// Generates embed sent to user
const generateResult = (
  embed: OsrsEmbed,
  playerObject: OsrsPlayer,
  field: keyof OsrsPlayer
): OsrsEmbed | ErrorEmbed => {
  // keyof is how I can index objects like that
  if (!playerObject) return errorHandler();
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
  embed.addField(
    `${OsrsRandom.SKILL.toUpperCase()}:`,
    `\`\`\`${skillName}\`\`\``
  );
  embed.addField(
    `${TempleOther.LEVEL.toUpperCase()}:`,
    `\`\`\`${skill[TempleOther.LEVEL]}\`\`\``
  );
  embed.addField(
    `${OsrsRandom.EXP_LONG.toUpperCase()}:`,
    `\`\`\`${formattedExp} ${TempleOther.EXP}\`\`\``
  );
  return embed;
};
