import { Message } from 'discord.js';
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
import { fetchPlayerNames } from '../../cache/templeCache';
import { isOnCooldown } from '../../cache/cooldown';
import { Embed } from '../../utils/embed';

export const fetchrsn = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const cooldown: number = 600;
  const nameCheck: string | null = runescapeNameValidator(args);
  if (nameCheck === null) return msg.channel.send(invalidUsername);
  const username: string = nameCheck;
  if (isOnCooldown(msg, commandName, cooldown, true, username) === true) return;
  else {
    const areNamesFetched: boolean = await fetchPlayerNames(msg, username);
    if (areNamesFetched === true) {
      const embed: Embed = new Embed();
      embed.setDescription(
        `Fetched latest names available for player:\`\`\`${username}\`\`\`To get more recent data - add a new datapoint and fetch again`
      );
      return msg.channel.send(embed);
    } else return;
  }
};
