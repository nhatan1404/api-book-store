import { Transform } from 'class-transformer';

export const DefaultValue = (defaultValue: any) => {
  return Transform((target: any) => target || defaultValue);
};
