export const capitalizeFirstLetter = (userInput: string): string => {
  const result: string = userInput.charAt(0).toUpperCase() + userInput.slice(1);
  return result;
};
