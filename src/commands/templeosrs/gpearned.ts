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
import { TempleOverviewOther } from '../../utils/osrs/interfaces';
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
// Anti-spam
import { antiSpam } from '../../cache/antiSpam';
// UTILS: Number formatter
import {
  numberFormatter,
  NumberFormatTypes,
} from '../../utils/numberFormatter';

export const gpearned = async (
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

  const cooldown: number = CommandCooldowns.GPEARNED;

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
    .setTitle(EmbedTitles.GP_EARNED)
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
    embed.addField(`${OsrsRandom.TIME_PERIOD}:`, `\`\`\`${capitalFirst}\`\`\``);
    // If boss has not been found, then return no data msg
    const gpEarned: string | number =
      playerObject[TempleOther.INFO][TempleOther.GP_EARNED];
    if (gpEarned === '-')
      embed.addField(
        `${OsrsRandom.NO_DATA}`,
        `No records for this period of time`
      );
    else {
      console.log(typeof gpEarned);

      embed.addField(
        `${OsrsRandom.GP_EARNED.toUpperCase()}:`,
        `\`\`\`${numberFormatter(gpEarned, NumberFormatTypes.EN_US)} gp\`\`\``
      );
      if (capitalFirst === 'All Time')
        embed.addField('NOTE:', `Temple boss tracking started on 01/01/2020`);
    }

    return embed;
  }
};
