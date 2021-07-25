// Discord
import { Message } from 'discord.js';
// TempleOSRS Cache
import { fetchTemple, playerOverviewSkill } from '../../cache/templeCache';
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
import { TempleOverviewSkill } from '../../utils/osrs/interfaces';
// UTILS: Enums
import {
  CommandCooldowns,
  OsrsRandom,
  TempleCacheType,
  TempleOther,
} from '../../utils/osrs/enums';
// UTILS: Runescape name validator
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Prefix validator
import { isPrefixValid } from '../../utils/osrs/isPrefixValid';
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';
// UTILS: Temple Overview time validator
import { templeOverviewTimeAliases } from '../../utils/osrs/inputValidator';
import {
  templeOverviewTimeValidator,
  formatOverviewTime,
} from '../../utils/osrs/templetime';
// Anti-spam
import { antiSpam } from '../../cache/antiSpam';
// UTILS: Number formatter
import {
  numberFormatter,
  NumberFormatTypes,
} from '../../utils/numberFormatter';

export const gpspent = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  if (antiSpam(msg, commandName) === true) return;
  const time: string | undefined = isPrefixValid(
    msg,
    args,
    templeOverviewTimeAliases
  );
  if (!time) return;
  const formattedTime: string | undefined = templeOverviewTimeValidator(time);

  const lowerCasedArguments: string[] = args.map((e: string) => {
    return e.toLowerCase();
  });

  const user: string[] = args.slice(1);

  const cooldown: number = CommandCooldowns.GP_SPENT;

  const username: string | undefined = runescapeNameValidator(user);
  if (!username) return msg.channel.send(invalidUsername);
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
  const userNameWithTime: string = username + formattedTime;
  const embed: TempleEmbed = new TempleEmbed()
    .setTitle(EmbedTitles.GP_SPENT)
    .addField(usernameString, `\`\`\`${username}\`\`\``);
  if (userNameWithTime in playerOverviewSkill) {
    const result: TempleEmbed = generateResult(
      embed,
      playerOverviewSkill[userNameWithTime],
      time as string
    );
    return msg.channel.send(result);
  } else {
    const dataType: TempleCacheType = TempleCacheType.PLAYER_OVERVIEW_SKILL;
    const isFetched: boolean = await fetchTemple(
      msg,
      username,
      dataType,
      formattedTime
    );
    if (isFetched === true) {
      const result: TempleEmbed = generateResult(
        embed,
        playerOverviewSkill[userNameWithTime],
        time as string
      );
      return msg.channel.send(result);
    } else return;
  }
};

// Generates embed sent to user
const generateResult = (
  embed: TempleEmbed,
  playerObject: TempleOverviewSkill,
  time: string
): TempleEmbed | ErrorEmbed => {
  if (!playerObject) return errorHandler();
  else {
    // Format time
    const formattedTime: string = formatOverviewTime(time);
    // Try to match boss index with field
    embed.addField(
      `${OsrsRandom.TIME_PERIOD}:`,
      `\`\`\`${formattedTime}\`\`\``
    );
    // If boss has not been found, then return no data msg
    const gpSpent: string | number =
      playerObject[TempleOther.INFO][TempleOther.GP_SPENT];
    if (gpSpent === '-')
      embed.addField(
        `${OsrsRandom.NO_DATA}`,
        `\`\`\`No data for this period of time\`\`\``
      );
    else {
      embed.addField(
        `${OsrsRandom.GP_SPENT.toUpperCase()}:`,
        `\`\`\`${numberFormatter(gpSpent, NumberFormatTypes.EN_US)} gp\`\`\``
      );
    }

    return embed;
  }
};
