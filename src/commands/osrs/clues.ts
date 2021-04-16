import { Message } from 'discord.js';
import {
  fetchOsrsStats,
  osrsStats,
  OsrsPlayer,
  BossOrMinigame,
} from '../../cache/osrsCache';
import { OsrsEmbed, OsrsEmbedTitles, usernameString } from '../../utils/embed';
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
    .setTitle(OsrsEmbedTitles.CLUES)
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
enum Clues {
  ALL = 'Clue_all',
  BEGINNER = 'Clue_beginner',
  EASY = 'Clue_easy',
  MEDIUM = 'Clue_medium',
  HARD = 'Clue_hard',
  ELITE = 'Clue_elite',
  MASTER = 'Clue_master',
}

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

const clueTypes: string[] = [
  'all',
  'beginner',
  'easy',
  'medium',
  'hard',
  'elite',
  'master',
];

// Checks clue type
const clueTypeCheck = (
  prefix: string,
  playerObject: OsrsPlayer
): BossOrMinigame => {
  const type: string = prefix;
  const playerStats: OsrsPlayer = playerObject;
  let cluesDoneNumber: BossOrMinigame;
  switch (type) {
    case 'all':
      cluesDoneNumber = playerStats[Clues.ALL];
      break;
    case 'beginner':
      cluesDoneNumber = playerStats[Clues.BEGINNER];
      break;
    case 'easy':
      cluesDoneNumber = playerStats[Clues.EASY];
      break;
    case 'medium':
      cluesDoneNumber = playerStats[Clues.MEDIUM];
      break;
    case 'hard':
      cluesDoneNumber = playerStats[Clues.HARD];
      break;
    case 'elite':
      cluesDoneNumber = playerStats[Clues.MEDIUM];
      break;
    case 'master':
      cluesDoneNumber = playerStats[Clues.MEDIUM];
      break;
    default:
      cluesDoneNumber = {
        rank: 'Unranked',
        score: 'Unranked',
      };
  }
  return cluesDoneNumber;
};
