export const runescapeNameValidator = (...args: string[]) => {
  const usernameCheck = args.join('');
  const regex = new RegExp(/^[\w_]{1,12}$/);
  const isValid = regex.test(usernameCheck);
  return isValid;
};
