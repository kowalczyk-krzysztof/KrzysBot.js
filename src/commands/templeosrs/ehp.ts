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
  TempleOther,
  TempleCacheType,
  SkillerOrF2p,
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
import { gameModeCheck, skillerOrF2P } from '../../utils/osrs/gameModeCheck';
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';
// Anti-spam
import { isSpamming } from '../../cache/antiSpam';

export const ehp = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined | ErrorEmbed> => {
  if (isSpamming(msg, commandName)) return;
  const cooldown = CommandCooldowns.EHP;
  const username: string | undefined = runescapeNameValidator(args);
  if (!username) return msg.channel.send(invalidUsername);
  if (isOnCooldown(msg, commandName, cooldown, false, username)) return;
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
    if (isFetched) {
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
    embed.addField(
      `${lastChecked.title.toUpperCase()}:`,
      `\`\`\`${lastChecked.time}\`\`\``
    );
    const f2pOrSkiller: string = skillerOrF2P(username);
    const TempleGameMode: string = gameModeCheck(username);
    let data: number;
    /*
    First check if player is ironman, if so add ironman ehp (the value is the same for all ironman accounts)
    Then check if account is f2p or skiller, if both add both fields else add respective fields. If none of the checks passes then just return normal EHP
    
    Expected result for lvl 3 f2p ironman skiller:
    EHP UIM
    4549
    EHP F2P
    6591
    EHP Level 3 skiller
    4064

  */
    if (TempleGameMode !== TempleGameModeFormatted.NORMAL) {
      data = parseInt(playerObject[TempleOther.IM_EHP_CAPITAL].toString());
      embed.addField(
        `${TempleOther.EHP.toUpperCase()} ${TempleGameMode}:`,
        `\`\`\`${data}\`\`\``
      );
    }
    if (f2pOrSkiller === SkillerOrF2p.BOTH) {
      embed.addField(
        `${TempleOther.EHP.toUpperCase()} ${SkillerOrF2p.F2P}:`,
        `\`\`\`${parseInt(playerObject[TempleOther.F2P_EHP].toString())}\`\`\``
      );
      embed.addField(
        `${TempleOther.EHP.toUpperCase()} ${SkillerOrF2p.SKILLER}:`,
        `\`\`\`${parseInt(playerObject[TempleOther.LVL3_EHP].toString())}\`\`\``
      );
    } else if (f2pOrSkiller === SkillerOrF2p.SKILLER)
      embed.addField(
        `${TempleOther.EHP.toUpperCase()} ${SkillerOrF2p.SKILLER}:`,
        `\`\`\`${parseInt(playerObject[TempleOther.LVL3_EHP].toString())}\`\`\``
      );
    else if (f2pOrSkiller === SkillerOrF2p.F2P)
      embed.addField(
        `${TempleOther.EHP.toUpperCase()} ${SkillerOrF2p.F2P}:`,
        `\`\`\`${parseInt(playerObject[TempleOther.F2P_EHP].toString())}\`\`\``
      );
    else if (
      f2pOrSkiller === SkillerOrF2p.NONE &&
      TempleGameMode === TempleGameModeFormatted.NORMAL
    ) {
      data = parseInt(playerObject[TempleOther.EHP].toString());
      embed.addField(
        `${TempleOther.EHP.toUpperCase()} ${TempleGameMode}:`,
        `\`\`\`${data}\`\`\``
      );
    }
    return embed;
  }
};
