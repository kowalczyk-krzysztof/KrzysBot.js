export const capitalizeFirstLetter = (userInput: string): string => {
  const input: string = userInput;
  const result: string = input.charAt(0).toUpperCase() + input.slice(1);
  return result;
};
