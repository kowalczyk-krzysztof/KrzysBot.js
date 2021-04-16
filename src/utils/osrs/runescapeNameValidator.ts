import { capitalizeFirstLetter } from '../capitalizeFirstLetter';
import { Embed } from '../embed';

export const runescapeNameValidator = (args: string[]): string | null => {
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
  else return null;
};

export const invalidUsername: Embed = new Embed().setDescription(
  'Invalid username'
);
