// UTILS: Enums
import {
  Clues,
  TempleOther,
  Skills,
  ClueNamesFormatted,
} from '../../utils/osrs/enums';

export const fieldNameFormatter = (field: string): string => {
  let formattedField: string;
  switch (field) {
    case Clues.ALL:
      formattedField = ClueNamesFormatted.ALL;
      break;
    case Clues.BEGINNER:
      formattedField = ClueNamesFormatted.BEGINNER;
      break;
    case Clues.EASY:
      formattedField = ClueNamesFormatted.EASY;
      break;
    case Clues.MEDIUM:
      formattedField = ClueNamesFormatted.MEDIUM;
      break;
    case Clues.HARD:
      formattedField = ClueNamesFormatted.HARD;
      break;
    case Clues.ELITE:
      formattedField = ClueNamesFormatted.ELITE;
      break;
    case Clues.MASTER:
      formattedField = ClueNamesFormatted.MASTER;
      break;
    case Skills.RC:
      formattedField = 'Runecrating';
      break;
    case TempleOther.EHB:
      formattedField = field.toUpperCase();
      break;
    case TempleOther.EHP:
      formattedField = field.toUpperCase();
      break;
    case TempleOther.IM_EHP:
      formattedField = 'Ironman EHP';
      break;

    default:
      formattedField = field;
      break;
  }
  return formattedField;
};
