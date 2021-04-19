// Discord
import { Message } from 'discord.js';
import { TempleOverviewTimeAliases, TempleOverviewTimes } from './enums';
// Valid times for Overview Command
import { templeOverviewTimeAliases } from './inputValidator';
// UTILS: Prefix validator
import { invalidPrefixMsg } from './isPrefixValid';

// Validator for commands using player overview endpoint
export const templeOverviewTimeValidator = (
  msg: Message,
  args: string[]
): string | undefined => {
  let timePeriod: string | undefined;
  if (args.length === 0)
    msg.channel.send(invalidPrefixMsg(templeOverviewTimeAliases));
  else if (!templeOverviewTimeAliases.includes(args[0].toLowerCase()))
    msg.channel.send(invalidPrefixMsg(templeOverviewTimeAliases));
  else {
    switch (args[0].toLowerCase()) {
      case TempleOverviewTimeAliases.FIVEMIN:
        timePeriod = TempleOverviewTimes.FIVEMIN;
        break;
      case TempleOverviewTimeAliases.DAY:
        timePeriod = TempleOverviewTimes.DAY;
        break;
      case TempleOverviewTimeAliases.WEEK:
        timePeriod = TempleOverviewTimes.WEEK;
        break;
      case TempleOverviewTimeAliases.MONTH:
        timePeriod = TempleOverviewTimes.MONTH;
        break;
      case TempleOverviewTimeAliases.HALFYEAR:
        timePeriod = TempleOverviewTimes.HALFYEAR;
        break;
      case TempleOverviewTimeAliases.YEAR:
        timePeriod = TempleOverviewTimes.YEAR;
        break;
      default:
        timePeriod = args[0].toLowerCase();
        break;
    }
  }
  return timePeriod;
};
