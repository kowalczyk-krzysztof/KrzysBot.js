import { Embed } from '../embed';

export const runescapeNameValidator = (args: string[]) => {
  const usernameCheck = args.join('_');
  const regex = new RegExp(/^[\w_]{1,12}$/);
  const isValid = regex.test(usernameCheck);
  return isValid;
};

export const invalidUsername = new Embed().setDescription('Invalid username');
