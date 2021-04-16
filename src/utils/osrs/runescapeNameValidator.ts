import { Embed } from '../embed';

export const runescapeNameValidator = (args: string[]): boolean => {
  const usernameCheck: string = args.join('_');
  const regex: RegExp = new RegExp(/^[\w_]{1,12}$/);
  const isValid: boolean = regex.test(usernameCheck);
  return isValid;
};

export const invalidUsername: Embed = new Embed().setDescription(
  'Invalid username'
);
