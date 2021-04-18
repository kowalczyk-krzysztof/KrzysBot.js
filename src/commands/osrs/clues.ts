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
import { ClueNamesFormatted, Clues, TempleOther } from '../../utils/osrs/enums';
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
import { clueFields, clueList } from '../../utils/osrs/inputValidator';

export const clues = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const lowerCasedArguments = args.map((e: string) => {
    return e.toLowerCase();
  });
  const prefix: string = isPrefixValid(msg, args, clueList, Categories.CLUES);
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
      lowerCasedArguments.join(', ')
    ) === true
  )
    return;
  const embed: OsrsEmbed = new OsrsEmbed()
    .setTitle(EmbedTitles.CLUES)
    .addField(usernameString, `${username}`);
  if (username in osrsStats) {
    const field: keyof OsrsPlayer | undefined = clueFields(
      prefix
    ) as keyof OsrsPlayer;
    if (field === undefined) return;
    const result: OsrsEmbed = generateResult(field, embed, osrsStats[username]);
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchOsrsStats(msg, username);
    if (isFetched === true) {
      const field: keyof OsrsPlayer | undefined = clueFields(
        prefix
      ) as keyof OsrsPlayer;
      if (field === undefined) return;
      const result: OsrsEmbed = generateResult(
        field,
        embed,
        osrsStats[username]
      );
      return msg.channel.send(result);
    } else return;
  }
};
// Generates embed sent to user
const generateResult = (
  field: keyof OsrsPlayer,
  embed: OsrsEmbed,
  playerObject: OsrsPlayer
): OsrsEmbed | ErrorEmbed => {
  if (playerObject === undefined) return new ErrorEmbed();
  else {
    const clueType: BossOrMinigame = playerObject[field] as BossOrMinigame;
    let formattedField: string;
    switch (field) {
      case Clues.ALL:
        formattedField = ClueNamesFormatted.ALL;
        break;
      case Clues.BEGINNER:
        formattedField = ClueNamesFormatted.BEGINNER;
        break;
      case Clues.EASY:
        formattedField = ClueNamesFormatted.EASY;
        break;
      case Clues.MEDIUM:
        formattedField = ClueNamesFormatted.MEDIUM;
        break;
      case Clues.HARD:
        formattedField = ClueNamesFormatted.HARD;
        break;
      case Clues.ELITE:
        formattedField = ClueNamesFormatted.ELITE;
        break;
      case Clues.MASTER:
        formattedField = ClueNamesFormatted.MASTER;
        break;

      default:
        formattedField = field;
        break;
    }
    embed.addField(`${formattedField}`, `${clueType[TempleOther.SCORE]}`);
    return embed;
  }
};
