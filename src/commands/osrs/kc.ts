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
import { TempleOther } from '../../utils/osrs/enums';
// UTILS: Runescape name validator
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Input validator
import { bossFields } from '../../utils/osrs/inputValidator';
// UTILS: Boss validator
import { bossValidator, BossCases } from '../../utils/osrs/bossValidator';

export const kc = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const indexes: number[] = [0, 1, 2];
  const lowerCasedArguments = args.map((e: string) => {
    return e.toLowerCase();
  });
  const bossValidation:
    | {
        bossCase: number;
        boss: string | undefined;
      }
    | undefined = bossValidator(msg, lowerCasedArguments, indexes);

  let user: string[];

  if (bossValidation === undefined) return;
  else if (bossValidation.bossCase === BossCases.ONE_WORD) {
    user = lowerCasedArguments.slice(1);
  } else if (bossValidation.bossCase === BossCases.TWO_WORD) {
    user = lowerCasedArguments.slice(2);
  } else if (bossValidation.bossCase === BossCases.THREE_WORDS) {
    user = lowerCasedArguments.slice(3);
  } else {
    user = lowerCasedArguments.slice(1);
  }
  const boss: keyof OsrsPlayer = bossValidation.boss as keyof OsrsPlayer;

  const cooldown: number = 30;

  const nameCheck: string = runescapeNameValidator(user);
  if (nameCheck === invalidRSN) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  if (
    isOnCooldown(
      msg,
      commandName,
      cooldown,
      false,
      lowerCasedArguments.join('')
    ) === true
  )
    return;
  const embed: OsrsEmbed = new OsrsEmbed()
    .setTitle(EmbedTitles.KC)
    .addField(usernameString, `${username}`);
  if (username in osrsStats) {
    const field: keyof OsrsPlayer | undefined = bossFields(
      boss
    ) as keyof OsrsPlayer;
    if (field === undefined) return;
    else {
      const result: OsrsEmbed = generateResult(
        field,
        embed,
        osrsStats[username]
      );
      return msg.channel.send(result);
    }
  } else {
    const isFetched: boolean = await fetchOsrsStats(msg, username);
    if (isFetched === true) {
      const field: keyof OsrsPlayer | undefined = bossFields(
        boss
      ) as keyof OsrsPlayer;
      if (field === undefined) return;
      else {
        const result: OsrsEmbed = generateResult(
          field,
          embed,
          osrsStats[username]
        );
        return msg.channel.send(result);
      }
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
    const boss: BossOrMinigame = playerObject[field] as BossOrMinigame;
    embed.addField(`${field} kills`, `${boss[TempleOther.SCORE]}`);
    return embed;
  }
};
