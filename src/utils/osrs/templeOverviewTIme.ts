// Discord
import { TempleOverviewTimeAliases, TempleOverviewTimes } from './enums';

// Validator for commands using player overview endpoint
export const templeOverviewTimeValidator = (
  time: string
): string | undefined => {
  let timePeriod: string | undefined;

  switch (time) {
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
    case TempleOverviewTimeAliases.ALLTIME:
      timePeriod = TempleOverviewTimes.ALLTIME;
      break;
    default:
      return;
  }

  return timePeriod;
};
