// Slice the provided arguments by provided number, then filter out \n, make a string out it then lowercase and trim white spaces.
export const argumentParser = (args: string[], slice: number = 0): string => {
  const firstStep: string = args
    .slice(slice)
    .filter((e: string) => {
      return e !== '\n';
    })
    .join(' ');
  const secondStep: string = firstStep.toLowerCase().trim();
  return secondStep;
};
