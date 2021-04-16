import { Message } from 'discord.js';
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
import { argumentParser, ParserTypes } from '../../utils/argumentParser';
import { fetchTemple, playerStats } from '../../cache/templeCache';
import { isOnCooldown } from '../../cache/cooldown';
import { Embed } from '../../utils/embed';
import { errorHandler } from '../../utils/errorHandler';

export const templefetch = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const cooldown: number = 600;
  const nameCheck: boolean = runescapeNameValidator(args);
  if (nameCheck === false) return msg.channel.send(invalidUsername);
  const keyword: string = argumentParser(args, 0, ParserTypes.OSRS);
  if (isOnCooldown(msg, commandName, cooldown, true, args) === true) return;
  else {
    const isPlayerFetched: boolean = await fetchTemple(msg, keyword);
    if (isPlayerFetched === true) {
      const username: string = playerStats[keyword].info.Username;
      const embed: Embed = new Embed();
      embed.setDescription(
        `Fetched latest data available for player:\`\`\`${username}\`\`\`To get more recent data - add a new datapoint and fetch again`
      );
      return msg.channel.send(embed);
    } else return errorHandler(null, msg);
  }
};
