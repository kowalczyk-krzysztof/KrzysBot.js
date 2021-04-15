export const argumentParser = (
  args: string[],
  slicedArgs: number = 0,
  type: string = ''
): string => {
  const firstStep: string = args.slice(slicedArgs).join(' ');
  let secondStep: string;
  if (type === ParserTypes.OSRS)
    secondStep = firstStep.toLowerCase().trim().replace(/_+/g, ' ');
  else secondStep = firstStep.toLowerCase().trim();

  return secondStep;
};

export enum ParserTypes {
  OSRS = 'osrs',
}
