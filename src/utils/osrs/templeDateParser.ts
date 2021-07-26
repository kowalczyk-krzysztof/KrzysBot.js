export const templeDateParser = (
  userInput: string
): { title: string; time: string } => {
  // TempleOSRS data is displayed as a format like this "2021-04-14 06:48:44" which when converted to parsetDate gives a date that is off by 2h so I need to remove 2h from it
  const templeFormatting: number = 7200;
  const title: string = 'Last Datapoint';
  const input: string = userInput;
  const parsedDate: number = new Date(input).getTime();
  const now: number = Date.now();
  const timeInSeconds: number = (now - parsedDate) / 1000 - templeFormatting;
  const secondsAsInt: number = parseInt(timeInSeconds.toString());
  if (secondsAsInt <= 60)
    return {
      title,
      time: `${secondsAsInt}s ago`,
    };
  const minutesDecimal: number = secondsAsInt / 60;
  const minutes: number = parseInt(minutesDecimal.toString());
  return {
    title,
    time: `${minutes} min ago`,
  };
};
