import { Message } from 'discord.js';
import { fetchOsrsStats, osrsStats, OsrsPlayer } from '../../cache/osrsCache';
import { OsrsEmbed, EmbedTitles, usernameString } from '../../utils/embed';
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
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

  const user: string[] = args.slice(1);
  const nameCheck: string | null = runescapeNameValidator(user);
  if (nameCheck === null) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  if (isOnCooldown(msg, commandName, cooldown, false, username) === true)
    return;
  const embed: OsrsEmbed = new OsrsEmbed()
    .setTitle(EmbedTitles.BH)
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
