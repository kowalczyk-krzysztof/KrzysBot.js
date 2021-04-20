// Discord
import { Message } from 'discord.js';
// TempleOSRS Cache
import { fetchTemple, playerOverviewOther } from '../../cache/templeCache';
// Cooldown cache
import { isOnCooldown } from '../../cache/cooldown';
// UTILS: Embeds
import {
  TempleEmbed,
  usernameString,
  EmbedTitles,
  ErrorEmbed,
} from '../../utils/embed';
// UTILS: Interfaces
import {
  TempleOtherTable,
  TempleOverviewOther,
} from '../../utils/osrs/interfaces';
// UTILS: Enums
import {
  CommandCooldowns,
  OsrsRandom,
  TempleCacheType,
  TempleOther,
  TempleOverviewTimeAliases,
} from '../../utils/osrs/enums';
// UTILS: Runescape name validator
import {
  runescapeNameValidator,
  invalidUsername,
  invalidRSN,
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Prefix validator
import { invalidPrefixMsg } from '../../utils/osrs/isPrefixValid';
// UTILS: Capitalize first letter
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';
// UTILS: Temple Overview time validator
import { templeOverviewTimeAliases } from '../../utils/osrs/inputValidator';
import { templeOverviewTimeValidator } from '../../utils/osrs/templeOverviewTIme';
// UTILS: Temple index to key
import { indexToBoss } from '../../utils/osrs/templeIndex';
// Anti-spam
import { antiSpam } from '../../cache/antiSpam';

export const topboss = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  if (antiSpam(msg, commandName) === true) return;
  if (args.length === 0)
    return msg.channel.send(invalidPrefixMsg(templeOverviewTimeAliases));
  const lowerCasedArguments: string[] = args.map((e: string) => {
    return e.toLowerCase();
  });
  const time: string | undefined = templeOverviewTimeValidator(
    msg,
    lowerCasedArguments
  );
  if (time === undefined) return;

  const user: string[] = args.slice(1);

  const cooldown: number = CommandCooldowns.TOPBOSS;

  const nameCheck: string = runescapeNameValidator(user);
  if (nameCheck === invalidRSN) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  // Check cooldown
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
  const userNameWithTime: string = username + time;
  const embed: TempleEmbed = new TempleEmbed()
    .setTitle(EmbedTitles.TOPBOSS)
    .addField(usernameString, `\`\`\`${username}\`\`\``);
  if (userNameWithTime in playerOverviewOther) {
    const result: TempleEmbed = generateResult(
      embed,
      playerOverviewOther[userNameWithTime],
      args[0]
    );
    return msg.channel.send(result);
  } else {
    const dataType: TempleCacheType = TempleCacheType.PLAYER_OVERVIEW_OTHER;
    const isFetched: boolean = await fetchTemple(msg, username, dataType, time);
    if (isFetched === true) {
      const result: TempleEmbed = generateResult(
        embed,
        playerOverviewOther[userNameWithTime],
        args[0]
      );
      return msg.channel.send(result);
    } else return;
  }
};

// Generates embed sent to user
const generateResult = (
  embed: TempleEmbed,
  playerObject: TempleOverviewOther,
  time: string
): TempleEmbed | ErrorEmbed => {
  if (playerObject === undefined || playerObject === null)
    return errorHandler();
  else {
    // Format time
    let capitalFirst: string = capitalizeFirstLetter(time);
    if (capitalFirst === TempleOverviewTimeAliases.HALFYEAR)
      capitalFirst = '6 months';
    else if (capitalFirst === 'Alltime') capitalFirst = 'All Time';
    else capitalFirst = capitalFirst;
    // Try to match boss index with fieldd
    const boss: keyof TempleOtherTable = indexToBoss(
      playerObject[TempleOther.INFO][TempleOther.TOP_BOSS]
    ) as keyof TempleOtherTable;
    embed.addField('TIME PERIOD:', `\`\`\`${capitalFirst}\`\`\``);
    // If boss has not been found, then return no data msg
    if (boss === undefined)
      embed.addField(`NO DATA`, `No records for this period of time`);
    else {
      embed.addField(
        `${OsrsRandom.BOSS.toUpperCase()}:`,
        `\`\`\`${boss}\`\`\``
      );
      let xp: number;
      if (playerObject[TempleOther.TABLE][boss][TempleOther.XP] === null)
        xp = 0;
      else xp = playerObject[TempleOther.TABLE][boss][TempleOther.XP];
      embed.addField(`${OsrsRandom.KILLS.toUpperCase()}:`, `\`\`\`${xp}\`\`\``);
      if (capitalFirst === 'All Time')
        embed.addField('NOTE:', `Temple boss tracking started on 01/01/2020`);
    }

    return embed;
  }
};
