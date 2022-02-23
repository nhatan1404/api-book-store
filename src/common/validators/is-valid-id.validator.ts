import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { BaseEntity, getRepository } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';

type Entity = typeof BaseEntity;

@ValidatorConstraint({ name: 'IsValidId', async: true })
@Injectable()
export class IsValidIdConstraint implements ValidatorConstraintInterface {
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Id với giá trị bằng ${validationArguments.value} không tồn tại`;
  }

  async validate(id: EntityId, args: ValidationArguments): Promise<boolean> {
    const entity = args.constraints[0];
    const options: object = args.constraints[1];
    const service = getRepository(entity);
    const data = await service.findOne(id, {
      ...options,
    });
    return !!data;
  }
}

export function IsValidId(
  property: Entity,
  options: object = {},
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property, options],
      validator: IsValidIdConstraint,
    });
  };
}
