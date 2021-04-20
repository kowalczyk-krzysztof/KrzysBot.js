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
import {
  TempleSkillTable,
  TempleOverviewSkill,
} from '../../utils/osrs/interfaces';
// UTILS: Enums
import {
  CommandCooldowns,
  OsrsRandom,
  Skills,
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
import { indexToSkill } from '../../utils/osrs/templeIndex';
// Anti-spam
import { antiSpam } from '../../cache/antiSpam';
// UTIILS: Number formatter
import {
  numberFormatter,
  NumberFormatTypes,
} from '../../utils/numberFormatter';

export const topskill = async (
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
    .setTitle(EmbedTitles.TOPSKILL)
    .addField(usernameString, `\`\`\`${username}\`\`\``);
  if (userNameWithTime in playerOverviewSkill) {
    const result: TempleEmbed = generateResult(
      embed,
      playerOverviewSkill[userNameWithTime],
      args[0]
    );
    return msg.channel.send(result);
  } else {
    const dataType: TempleCacheType = TempleCacheType.PLAYER_OVERVIEW_SKILL;
    const isFetched: boolean = await fetchTemple(msg, username, dataType, time);
    if (isFetched === true) {
      const result: TempleEmbed = generateResult(
        embed,
        playerOverviewSkill[userNameWithTime],
        args[0]
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
  if (playerObject === undefined || playerObject === null)
    return errorHandler();
  else {
    // Format time
    let capitalFirst: string = capitalizeFirstLetter(time);
    if (capitalFirst === TempleOverviewTimeAliases.HALFYEAR)
      capitalFirst = '6 months';
    else if (capitalFirst === 'Alltime') capitalFirst = 'All Time';
    else capitalFirst = capitalFirst;
    // Try to match skill index with fieldd
    const skill: keyof TempleSkillTable = indexToSkill(
      playerObject[TempleOther.INFO][TempleOther.TOP_SKILL]
    ) as keyof TempleSkillTable;
    embed.addField('TIME PERIOD:', `\`\`\`${capitalFirst}\`\`\``);
    // If boss has not been found, then return no data msg
    if (skill === undefined)
      embed.addField(`NO DATA`, `No records for this period of time`);
    else {
      let formattedSkill;
      if (skill === Skills.RC) formattedSkill = OsrsRandom.RUNECRAFTING;
      else formattedSkill = skill;
      embed.addField(
        `${OsrsRandom.SKILL.toUpperCase()}:`,
        `\`\`\`${formattedSkill}\`\`\``
      );
      let xp: number | string | undefined;
      if (playerObject[TempleOther.TABLE][skill][TempleOther.XP] === null)
        xp = 0;
      else
        xp = numberFormatter(
          playerObject[TempleOther.TABLE][skill][TempleOther.XP],
          NumberFormatTypes.EN_US
        );
      embed.addField(
        `${OsrsRandom.EXP_LONG.toUpperCase()}:`,
        `\`\`\`${xp} ${TempleOther.EXP}\`\`\``
      );
    }

    return embed;
  }
};
