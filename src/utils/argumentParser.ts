// Slice the provided arguments by provided number, then filter out \n, make a string out it. Check the type, lowercase, trim white spaces and perform actions based on type
export const argumentParser = (
  args: string[],
  slice: number = 0,
  type: string = ''
): string => {
  const firstStep: string = args
    .slice(slice)
    .filter((e: string) => {
      return e !== '\n';
    })
    .join(' ');
  let secondStep: string;
  if (type === ParserTypes.OSRS)
    secondStep = firstStep.toLowerCase().trim().replace(/_+/g, ' ');
  else secondStep = firstStep.toLowerCase().trim();

  return secondStep;
};

export enum ParserTypes {
  OSRS = 'osrs',
}
