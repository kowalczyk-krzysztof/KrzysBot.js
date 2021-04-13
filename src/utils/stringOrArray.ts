// Helper method for parsing user input for use in fetching data from webpages. Most of the time it doesn't matter if you use "foo bar" or "foo,bar" so this is where this method is used. If there is only one word - return it as a string, if there's multiple - return as an array
export const stringOrArray = (...args: string[]) => {
  let keyword: string;
  if (args.length > 1) keyword = args.join(' ').toLowerCase();
  else keyword = args[0].toLowerCase();
  return keyword;
};
