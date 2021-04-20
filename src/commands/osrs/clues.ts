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
import { OsrsPlayer, BossOrMinigame } from '../../utils/osrs/interfaces';
// UTILS: Enums
import { CommandCooldowns, TempleOther } from '../../utils/osrs/enums';
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
import { clueFields, clueList } from '../../utils/osrs/inputValidator';
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';
// UTILS: FIeld name formatter
import { fieldNameFormatter } from '../../utils/osrs/fieldNameFormatter';
// Anti-spam
import { antiSpam } from '../../cache/antiSpam';

export const clues = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  if (antiSpam(msg, commandName) === true) return;
  if (args.length === 0)
    return msg.channel.send(invalidPrefixMsg(clueList, PrefixCategories.CLUES));
  // This is done so the cooldown is per unique command
  const lowerCasedArguments: string[] = args.map((e: string) => {
    return e.toLowerCase();
  });
  const prefix: string = isPrefixValid(
    msg,
    args,
    clueList,
    PrefixCategories.CLUES
  );
  if (prefix === invalidPrefix) return;
  const cooldown: number = CommandCooldowns.CLUES;
  const nameCheck: string = runescapeNameValidator(args.slice(1));
  if (nameCheck === invalidRSN) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  if (
    isOnCooldown(
      msg,
      commandName,
      cooldown,
      false,
      lowerCasedArguments.join(', ')
    ) === true
  )
    return;
  const embed: OsrsEmbed = new OsrsEmbed()
    .setTitle(EmbedTitles.CLUES)
    .addField(usernameString, `\`\`\`${username}\`\`\``);
  if (username in osrsStats) {
    const field: keyof OsrsPlayer | undefined = clueFields(
      prefix
    ) as keyof OsrsPlayer;
    if (field === undefined) return;
    const result: OsrsEmbed = generateResult(embed, osrsStats[username], field);
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchOsrsStats(msg, username);
    if (isFetched === true) {
      const field: keyof OsrsPlayer | undefined = clueFields(
        prefix
      ) as keyof OsrsPlayer;
      if (field === undefined) return;
      const result: OsrsEmbed = generateResult(
        embed,
        osrsStats[username],
        field
      );
      return msg.channel.send(result);
    } else return;
  }
};
// Generates embed sent to user
const generateResult = (
  embed: OsrsEmbed,
  playerObject: OsrsPlayer,
  field: keyof OsrsPlayer
): OsrsEmbed | ErrorEmbed => {
  if (playerObject === undefined || playerObject === null)
    return errorHandler();
  else {
    const clueType: BossOrMinigame = playerObject[field] as BossOrMinigame;
    const formattedField: string = fieldNameFormatter(field);
    embed.addField(
      `${formattedField.toUpperCase()}:`,
      `\`\`\`${clueType[TempleOther.SCORE]}\`\`\``
    );
    return embed;
  }
};
