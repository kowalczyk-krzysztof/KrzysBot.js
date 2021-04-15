import { Message } from 'discord.js';
import { fetchOsrsStats, osrsStats, OsrsPlayer } from '../../cache/osrsCache';
import { Embed } from '../../utils/embed';
import { runescapeNameValidator } from '../../utils/osrs/runescapeNameValidator';
import { argumentParser } from '../../utils/argumentParser';
import { isPrefixValid, Categories } from '../../utils/osrs/isPrefixValid';
import { isOnCooldown } from '../../cache/cooldown';

export const clues = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const prefix: string | null = isPrefixValid(
    msg,
    args,
    types,
    Categories.CLUES
  );
  if (prefix === null) return;
  if (isOnCooldown(msg, commandName, 30, false, args) === true) return;
  const usernameWithoutSpaces: string[] = args.slice(1);
  const nameCheck: boolean = runescapeNameValidator(usernameWithoutSpaces);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const usernameWithSpaces: string = argumentParser(args, 1, 'osrs');
  const embed: Embed = new Embed()
    .setTitle('Clues')
    .addField('Username', `${usernameWithSpaces}`);
  if (usernameWithSpaces in osrsStats) {
    const result = generateResult(prefix, embed, osrsStats[usernameWithSpaces]);
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchOsrsStats(msg, usernameWithSpaces);
    if (isFetched === true) {
      const result = generateResult(
        prefix,
        embed,
        osrsStats[usernameWithSpaces]
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
  inputEmbed: Embed,
  playerObject: OsrsPlayer
): Embed => {
  const embed: Embed = inputEmbed;
  const player: OsrsPlayer = playerObject;
  const clueType: {
    rank: number;
    score: number;
  } = clueTypeCheck(prefix, player);
  embed.addField(`Clues ${prefix}`, `${clueType.score}`);
  return embed;
};

const types: string[] = [
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
): {
  rank: number;
  score: number;
} => {
  const type: string = prefix;
  const playerStats = playerObject;
  let cluesDoneNumber;
  // else return 0;
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
        rank: 0,
        score: 0,
      };
  }
  return cluesDoneNumber;
};
