import { Message } from 'discord.js';
import { fetchOsrsStats, osrsStats, OsrsPlayer } from '../../cache/osrsCache';
import { OsrsEmbed, OsrsEmbedTitles, usernameString } from '../../utils/embed';
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
import { argumentParser, ParserTypes } from '../../utils/argumentParser';
import { isOnCooldown } from '../../cache/cooldown';

export const lms = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const cooldown: number = 30;
  if (isOnCooldown(msg, commandName, cooldown, false, args) === true) return;

  const nameCheck: boolean = runescapeNameValidator(args);
  if (nameCheck === false) return msg.channel.send(invalidUsername);
  const usernameWithSpaces: string = argumentParser(args, 0, ParserTypes.OSRS);
  const embed: OsrsEmbed = new OsrsEmbed()
    .setTitle(OsrsEmbedTitles.LMS)
    .addField(usernameString, `${usernameWithSpaces}`);
  if (usernameWithSpaces in osrsStats) {
    const result: OsrsEmbed = generateResult(
      embed,
      osrsStats[usernameWithSpaces]
    );
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchOsrsStats(msg, usernameWithSpaces);
    if (isFetched === true) {
      const result: OsrsEmbed = generateResult(
        embed,
        osrsStats[usernameWithSpaces]
      );
      return msg.channel.send(result);
    } else return;
  }
};
// Generates embed sent to user
const generateResult = (
  inputEmbed: OsrsEmbed,
  playerObject: OsrsPlayer
): OsrsEmbed => {
  const embed: OsrsEmbed = inputEmbed;
  const player: OsrsPlayer = playerObject;
  embed.addField(`LMS Score`, `${player.Lms_Rank.score}`);
  return embed;
};
