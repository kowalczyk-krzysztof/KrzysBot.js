// UTILS: Enums
import { TempleOverviewTimeAliases, TempleOverviewTimes } from './enums';
// UTILS: Capitalize first letter
import { capitalizeFirstLetter } from '../capitalizeFirstLetter';

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

export const formatOverviewTime = (time: string): string => {
  let formattedTime: string;
  switch (time) {
    case TempleOverviewTimeAliases.HALFYEAR:
      formattedTime = '6 months';
      break;
    case TempleOverviewTimeAliases.FIVEMIN:
      formattedTime = '5 min';
      break;
    case TempleOverviewTimeAliases.ALLTIME:
      formattedTime = 'All Time';
      break;
    default:
      formattedTime = capitalizeFirstLetter(time);
  }
  return formattedTime;
};
