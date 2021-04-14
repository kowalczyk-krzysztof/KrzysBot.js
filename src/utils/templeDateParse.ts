export const templeDateParser = (userInput: string): string => {
  const input: string = userInput;
  const parsedDate: number = new Date(input).getTime();
  const now: number = Date.now();
  const timeInSeconds: number = (now - parsedDate) / 1000;
  const secondsAsInt: number = parseInt(timeInSeconds.toString());

  if (secondsAsInt <= 60) return `*${secondsAsInt} s ago`;
  else {
    const minutesDecimal: number = secondsAsInt / 60;
    const minutes: number = parseInt(minutesDecimal.toString());
    return `${minutes} min ago`;
  }
};
