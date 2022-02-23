export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const castStringToNumber = (value: string) =>
  isNaN(+value) ? 0 : +value;
