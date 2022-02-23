import { IS_PUBLIC_KEY } from './../constants/decorator.contants';
import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const Public = (): CustomDecorator<string> => {
  return SetMetadata(IS_PUBLIC_KEY, true);
};
