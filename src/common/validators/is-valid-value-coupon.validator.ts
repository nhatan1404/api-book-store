import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CouponType } from '../../coupon/enum/coupon-type.enum';

export function IsValidCouponValue(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsValidCouponValueConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsValidCouponValue' })
export class IsValidCouponValueConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;
    const typeCoupon = (args.object as any)[relatedPropertyName];

    if (!(typeCoupon == CouponType.PERCENT && value >= 1 && value <= 100)) {
      return false;
    }

    return true;
  }

  defaultMessage(): string {
    return `Giá trị mã giảm giá phải từ 1 đến 100`;
  }
}
