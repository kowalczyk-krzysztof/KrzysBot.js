// Discord
import { Message } from 'discord.js';
// TempleOSRS Cache
import { playerStats, fetchTemple } from '../../cache/templeCache';
// Cooldown cache
import { isOnCooldown } from '../../cache/cooldown';
// UTILS: Embeds
import { ErrorEmbed, TempleEmbed, usernameString } from '../../utils/embed';
// UTILS: Interfaces
import { TemplePlayerStats } from '../../utils/osrs/interfaces';
// UTILS: Enums
import {
  TempleCacheType,
  TempleOther,
  TempleGameModeFormatted,
  CommandCooldowns,
} from '../../utils/osrs/enums';
// UTILS: Runescape name validator
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
// UTILS: Temple date parser
import { templeDateParser } from '../../utils/osrs/templeDateParser';
// UTILS: Game mode validator
import { gameModeCheck } from '../../utils/osrs/gameModeCheck';
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';
// Anti-spam
import { antiSpam } from '../../cache/antiSpam';

export const ehb = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined | ErrorEmbed> => {
  if (antiSpam(msg, commandName) === true) return;
  const cooldown: number = CommandCooldowns.EHB;
  const username: string | undefined = runescapeNameValidator(args);
  if (!username) return msg.channel.send(invalidUsername);
  if (isOnCooldown(msg, commandName, cooldown, false, username) === true)
    return;
  const embed: TempleEmbed = new TempleEmbed().addField(
    usernameString,
    `\`\`\`${username}\`\`\``
  );
  if (username in playerStats) {
    const result: TempleEmbed = generateResult(
      embed,
      playerStats[username],
      username
    );
    return msg.channel.send(result);
  } else {
    const dataType: TempleCacheType = TempleCacheType.PLAYER_STATS;
    const isFetched: boolean = await fetchTemple(msg, username, dataType);
    if (isFetched === true) {
      const result: TempleEmbed = generateResult(
        embed,
        playerStats[username],
        username
      );
      return msg.channel.send(result);
    } else return;
  }
};
// Generates embed sent to user
const generateResult = (
  embed: TempleEmbed,
  playerObject: TemplePlayerStats,
  username: string
): TempleEmbed | ErrorEmbed => {
  if (!playerObject) return errorHandler();
  else {
    const lastChecked: { title: string; time: string } = templeDateParser(
      playerObject[TempleOther.INFO][TempleOther.LAST_CHECKED]
    );
    const TempleGameMode: string = gameModeCheck(username);
    embed.addField(
      `${lastChecked.title.toUpperCase()}:`,
      `\`\`\`${lastChecked.time}\`\`\``
    );
    let data: number;
    if (TempleGameMode === TempleGameModeFormatted.NORMAL)
      data = parseInt(playerObject[TempleOther.EHB].toString());
    else data = parseInt(playerObject[TempleOther.IM_EHB].toString());
    embed.addField(
      `${TempleOther.EHB.toUpperCase()} ${TempleGameMode}:`,
      `\`\`\`${data}\`\`\``
    );
    return embed;
  }
};
