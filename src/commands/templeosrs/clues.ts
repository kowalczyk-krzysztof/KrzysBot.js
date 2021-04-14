import { Message } from 'discord.js';
import { playerStats, fetchTemple, PlayerStats } from '../../cache/templeCache';
import { TempleEmbed } from '../../utils/embed';
import { templeDateParser } from '../../utils/osrs/templeDateParser';
import { runescapeNameValidator } from '../../utils/osrs/runescapeNameValidator';
import { argsWithPrefixToString } from '../../utils/argsToString';
import { isPrefixValid } from '../../utils/osrs/isPrefixValid';

const types: string[] = [
  'all',
  'beginner',
  'easy',
  'medium',
  'hard',
  'elite',
  'master',
];

export const clues = async (
  msg: Message,
  ...args: string[]
): Promise<Message | undefined> => {
  const prefix: string | null = isPrefixValid(msg, args, types, 'clues');
  if (prefix === null) return;
  const usernameWithoutSpaces: string = args.slice(1).join('');
  const nameCheck: boolean = runescapeNameValidator(usernameWithoutSpaces);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const usernameWithSpaces: string = argsWithPrefixToString(...args);
  const embed: TempleEmbed = new TempleEmbed()
    .setTitle('Clues')
    .addField('Username', `${usernameWithSpaces}`);
  if (usernameWithSpaces in playerStats) {
    const result = generateEmbed(
      prefix,
      embed,
      playerStats[usernameWithSpaces]
    );
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchTemple(msg, usernameWithSpaces);
    if (isFetched === true) {
      const result = generateEmbed(
        prefix,
        embed,
        playerStats[usernameWithSpaces]
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
const generateEmbed = (
  prefix: string,
  inputEmbed: TempleEmbed,
  playerObject: PlayerStats
): TempleEmbed => {
  const embed: TempleEmbed = inputEmbed;
  const player: PlayerStats = playerObject;
  const lastChecked: { title: string; time: string } = templeDateParser(
    player.info['Last checked']
  );
  embed.addField(`${lastChecked.title}`, `${lastChecked.time}`);
  const clueType: number = clueTypeCheck(prefix, player);
  embed.addField(`Clues ${prefix}`, `${clueType}`);
  return embed;
};
// Checks clue type
const clueTypeCheck = (prefix: string, playerObject: PlayerStats): number => {
  const type: string = prefix;
  const playerStats = playerObject;
  let cluesDoneNumber: number;
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
      cluesDoneNumber = 0;
  }
  return cluesDoneNumber;
};
