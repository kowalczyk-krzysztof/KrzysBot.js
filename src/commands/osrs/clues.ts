import { Message } from 'discord.js';
import { ClueAliases, Clues } from '../../utils/osrs/enums';
import {
  fetchOsrsStats,
  osrsStats,
  OsrsPlayer,
  BossOrMinigame,
} from '../../cache/osrsCache';
import { OsrsEmbed, EmbedTitles, usernameString } from '../../utils/embed';
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
import { isPrefixValid, Categories } from '../../utils/osrs/isPrefixValid';
import { isOnCooldown } from '../../cache/cooldown';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

export const clues = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const prefix: string | null = isPrefixValid(
    msg,
    args,
    clueTypes,
    Categories.CLUES
  );
  if (prefix === null) return;
  const cooldown: number = 30;
  const nameCheck: string | null = runescapeNameValidator(args.slice(1));
  if (nameCheck === null) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  if (isOnCooldown(msg, commandName, cooldown, false, username) === true)
    return;
  const embed: OsrsEmbed = new OsrsEmbed()
    .setTitle(EmbedTitles.CLUES)
    .addField(usernameString, `${username}`);
  if (username in osrsStats) {
    const result: OsrsEmbed = generateResult(
      prefix,
      embed,
      osrsStats[username]
    );
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchOsrsStats(msg, username);
    if (isFetched === true) {
      const result: OsrsEmbed = generateResult(
        prefix,
        embed,
        osrsStats[username]
      );
      return msg.channel.send(result);
    } else return;
  }
};

// Clue key names

// Generates embed sent to user
const generateResult = (
  prefix: string,
  inputEmbed: OsrsEmbed,
  playerObject: OsrsPlayer
): OsrsEmbed => {
  const embed: OsrsEmbed = inputEmbed;
  const player: OsrsPlayer = playerObject;
  const clueType: BossOrMinigame = clueTypeCheck(prefix, player);
  embed.addField(`Clues ${capitalizeFirstLetter(prefix)}`, `${clueType.score}`);
  return embed;
};

export const clueTypes: string[] = [
  ClueAliases.ALL,
  ClueAliases.BEGINNER,
  ClueAliases.EASY,
  ClueAliases.MEDIUM,
  ClueAliases.HARD,
  ClueAliases.ELITE,
  ClueAliases.MASTER,
];

// Checks clue type
export const clueTypeCheck = (
  prefix: string,
  playerObject: OsrsPlayer
): BossOrMinigame => {
  const type: string = prefix;
  const playerStats: OsrsPlayer = playerObject;
  let cluesDoneNumber: BossOrMinigame;
  switch (type) {
    case ClueAliases.ALL:
      cluesDoneNumber = playerStats[Clues.ALL];
      break;
    case ClueAliases.BEGINNER:
      cluesDoneNumber = playerStats[Clues.BEGINNER];
      break;
    case ClueAliases.EASY:
      cluesDoneNumber = playerStats[Clues.EASY];
      break;
    case ClueAliases.MEDIUM:
      cluesDoneNumber = playerStats[Clues.MEDIUM];
      break;
    case ClueAliases.HARD:
      cluesDoneNumber = playerStats[Clues.HARD];
      break;
    case ClueAliases.ELITE:
      cluesDoneNumber = playerStats[Clues.ELITE];
      break;
    case ClueAliases.MASTER:
      cluesDoneNumber = playerStats[Clues.MASTER];
      break;
    default:
      cluesDoneNumber = {
        rank: 'Unranked',
        score: 'Unranked',
      };
  }
  return cluesDoneNumber;
};
