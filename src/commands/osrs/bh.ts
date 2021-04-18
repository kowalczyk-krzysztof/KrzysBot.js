import { Message } from 'discord.js';
import { fetchOsrsStats, osrsStats, OsrsPlayer } from '../../cache/osrsCache';
import {
  OsrsEmbed,
  EmbedTitles,
  usernameString,
  ErrorEmbed,
} from '../../utils/embed';
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
import {
  isPrefixValid,
  Categories,
  invalidPrefix,
} from '../../utils/osrs/isPrefixValid';
import { isOnCooldown } from '../../cache/cooldown';
import {
  OsrsOther,
  OsrsOtherAliases,
  TempleOther,
} from '../../utils/osrs/enums';

export const bh = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const prefix: string = isPrefixValid(msg, args, bhTypes, Categories.BH);
  if (prefix === invalidPrefix) return;
  const cooldown: number = 30;

  const user: string[] = args.slice(1);
  const nameCheck: string = runescapeNameValidator(user);
  if (nameCheck === invalidRSN) return msg.channel.send(invalidUsername);
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

// Key names
enum BH {
  ROGUE = 'BH Rogue',
  HUNTER = 'BH Hunter',
}

// Generates embed sent to user
const generateResult = (
  prefix: string,
  inputEmbed: OsrsEmbed,
  playerObject: OsrsPlayer
): OsrsEmbed | ErrorEmbed => {
  if (playerObject === undefined) return new ErrorEmbed();
  let scoreType: string | number;
  let title: string;
  if (prefix === OsrsOtherAliases.BH_ROGUE) {
    scoreType = playerObject[OsrsOther.BH_ROGUE][TempleOther.SCORE];
    title = BH.ROGUE;
  } else {
    scoreType = playerObject[OsrsOther.BH_HUNTER][TempleOther.SCORE];
    title = BH.HUNTER;
  }
  inputEmbed.addField(`${title} score`, `${scoreType}`);
  return inputEmbed;
};

export const bhTypes: string[] = [
  OsrsOtherAliases.BH_ROGUE,
  OsrsOtherAliases.BH_HUNTER,
];
