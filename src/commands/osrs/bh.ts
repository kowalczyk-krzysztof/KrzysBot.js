import { Message } from 'discord.js';
import { fetchOsrsStats, osrsStats, OsrsPlayer } from '../../cache/osrsCache';
import { OsrsEmbed, OsrsEmbedTitles, usernameString } from '../../utils/embed';
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
import { argumentParser, ParserTypes } from '../../utils/argumentParser';
import { isPrefixValid, Categories } from '../../utils/osrs/isPrefixValid';
import { isOnCooldown } from '../../cache/cooldown';

export const bh = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const prefix: string | null = isPrefixValid(
    msg,
    args,
    bhTypes,
    Categories.BH
  );
  if (prefix === null) return;
  const cooldown: number = 30;
  if (isOnCooldown(msg, commandName, cooldown, false, args) === true) return;
  const usernameWithoutSpaces: string[] = args.slice(1);
  const nameCheck: boolean = runescapeNameValidator(usernameWithoutSpaces);
  if (nameCheck === false) return msg.channel.send(invalidUsername);
  const usernameWithSpaces: string = argumentParser(args, 1, ParserTypes.OSRS);
  const embed: OsrsEmbed = new OsrsEmbed()
    .setTitle(OsrsEmbedTitles.BH)
    .addField(usernameString, `${usernameWithSpaces}`);
  if (usernameWithSpaces in osrsStats) {
    const result: OsrsEmbed = generateResult(
      prefix,
      embed,
      osrsStats[usernameWithSpaces]
    );
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchOsrsStats(msg, usernameWithSpaces);
    if (isFetched === true) {
      const result: OsrsEmbed = generateResult(
        prefix,
        embed,
        osrsStats[usernameWithSpaces]
      );
      return msg.channel.send(result);
    } else return;
  }
};

// Clue key names
enum BH {
  ROGUE = 'BH Rogue',
  HUNTER = 'BH Hunter',
}

// Generates embed sent to user
const generateResult = (
  prefix: string,
  inputEmbed: OsrsEmbed,
  playerObject: OsrsPlayer
): OsrsEmbed => {
  const embed: OsrsEmbed = inputEmbed;
  const player: OsrsPlayer = playerObject;
  let scoreType: string | number;
  let title: string;
  if (prefix === bhTypes[0]) {
    scoreType = player.Bh_Rogue.score;
    title = BH.ROGUE;
  } else {
    scoreType = player.Bh_Hunter.score;
    title = BH.HUNTER;
  }
  embed.addField(`${title} score`, `${scoreType}`);
  return embed;
};

export const bhTypes: string[] = ['rogue', 'hunter'];
