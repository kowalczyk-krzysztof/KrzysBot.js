export enum NumberFormatTypes {
  INT = 'int',
  EN_US = 'en-US',
  EN_GB = 'en-GB',
}

export const numberFormatter = (
  nr: number | string,
  type: string
): string | number | undefined => {
  if (typeof nr !== 'number' && typeof nr !== 'string') return;
  // en-us formatting
  const formatter: Intl.NumberFormat = new Intl.NumberFormat(
    NumberFormatTypes.EN_US,
    { maximumFractionDigits: 0 }
  );
  if (type === NumberFormatTypes.EN_US && typeof nr === 'number')
    return formatter.format(nr);
  if (type === NumberFormatTypes.EN_GB && typeof nr === 'string') {
    const stringToDate: Date = new Date(nr);
    return new Intl.DateTimeFormat(NumberFormatTypes.EN_GB).format(
      stringToDate
    );
  }
  return parseInt(nr.toString());
};
