import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BaseEntity, getRepository } from 'typeorm';
import { capitalize } from '../utils/utilities.util';

type Entity = typeof BaseEntity;

@ValidatorConstraint({ name: 'IsUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  defaultMessage(validationArguments?: ValidationArguments): string {
    const { property, value } = validationArguments;
    return `${capitalize(
      property,
    )} với giá trị bằng '${value}' đã được sử dụng`;
  }

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const entity = args.constraints[0];
    const service = getRepository(entity);
    const data = await service.findOne({
      [args.property]: value,
    });
    return !data;
  }
}

export function IsUnique(
  property: Entity,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsUniqueConstraint,
    });
  };
}
