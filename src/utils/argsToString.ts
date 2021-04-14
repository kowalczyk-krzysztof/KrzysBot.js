// Helper method for parsing user input for use in fetching data
export const argsToString = (...args: string[]): string => {
  const keyword: string = args
    .join(' ')
    .replace(/_+/g, ' ')
    .toLowerCase()
    .trim();
  return keyword;
};
// Same as above except for when you need a prefix e.g ".clues all <username>"
export const argsWithPrefixToString = (...args: string[]): string => {
  const keyword: string = args
    .slice(1)
    .join(' ')
    .replace(/_+/g, ' ')
    .toLowerCase()
    .trim();
  return keyword;
};
