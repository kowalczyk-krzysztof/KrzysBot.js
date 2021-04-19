// UTILS: Embeds
import { Embed } from '../embed';
// UTILS: Capitalize first letter
import { capitalizeFirstLetter } from '../capitalizeFirstLetter';

export const invalidRSN = 'INVALID';

export const runescapeNameValidator = (args: string[]): string => {
  if (args.length === 0) return invalidRSN;
  let split;
  if (args.length === 1)
    split = args[0].split(/_/g).filter((e: string) => {
      return e !== '';
    });
  else split = args;
  const removeUnderscore: RegExp = /_/g;
  const formatArguments: string[] = split.map((e: string) => {
    return capitalizeFirstLetter(e.replace(removeUnderscore, '').toLowerCase());
  });
  const formattedUsername: string = formatArguments.join(' ');
  const regex: RegExp = new RegExp(/^[\w_ ]{1,12}$/);
  const isValid: boolean = regex.test(formattedUsername);
  if (isValid === true) return formattedUsername;
  else return invalidRSN;
};

export const invalidUsername: Embed = new Embed().setDescription(
  'Invalid username'
);
