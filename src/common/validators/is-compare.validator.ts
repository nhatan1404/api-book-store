import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { BaseEntity, getRepository } from 'typeorm';

type Entity = typeof BaseEntity;
type CallbackCompare = (a: any, b: any) => boolean;

@ValidatorConstraint({ name: 'Compare', async: true })
@Injectable()
export class CompareConstraint implements ValidatorConstraintInterface {
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Giá trị bằng ${validationArguments.value} không thoả điều kiện`;
  }

  async validate(value: number, args: ValidationArguments): Promise<boolean> {
    const payload = args.object as any;
    const entity: Entity = args.constraints[0];
    const property: string = args.constraints[1];
    const operator: CallbackCompare = args.constraints[2];
    const service = getRepository(entity);
    const data = await service.findOne(payload['id']);
    if (!data) return false;
    return operator(value, data[property]);
  }
}

export function Compare(
  entity: Entity,
  property: string,
  operator: CallbackCompare,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, property, operator],
      validator: CompareConstraint,
    });
  };
}
