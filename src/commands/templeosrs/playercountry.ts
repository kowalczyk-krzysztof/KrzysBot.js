import { Message } from 'discord.js';
import {
  runescapeNameValidator,
  invalidUsername,
} from '../../utils/osrs/runescapeNameValidator';
import { argumentParser, ParserTypes } from '../../utils/argumentParser';
import { TempleEmbed, usernameString } from '../../utils/embed';
import { playerStats, fetchTemple, PlayerStats } from '../../cache/templeCache';

export const playercountry = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  const nameCheck: boolean = runescapeNameValidator(args);
  if (nameCheck === false) return msg.channel.send(invalidUsername);
  const keyword: string = argumentParser(args, 0, ParserTypes.OSRS);
  if (keyword in playerStats) {
    const result: TempleEmbed = generateResult(playerStats[keyword]);
    return msg.channel.send(result);
  } else {
    const isFetched: boolean = await fetchTemple(msg, keyword);
    if (isFetched === true) {
      const result: TempleEmbed = generateResult(playerStats[keyword]);
      return msg.channel.send(result);
    } else return;
  }
};

// Generate result
const generateResult = (playerObject: PlayerStats): TempleEmbed => {
  const embed: TempleEmbed = new TempleEmbed().addField(
    usernameString,
    `${playerObject.info.Username}`
  );
  const data: string = playerObject.info.Country;
  if (data === '-') embed.addField('Country', 'No Info');
  else embed.addField('Country', `${data}`);
  return embed;
};
