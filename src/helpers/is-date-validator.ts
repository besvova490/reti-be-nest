import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
} from 'class-validator';
import * as dayjs from 'dayjs';

@ValidatorConstraint({ name: 'isDateValid', async: false })
export class IsDateValidConstraint {
  validate(value: string, constraints: string[]) {
    const date = dayjs(value, constraints[0] || 'YYYY-MM-DD:HH:MM');

    return date.isValid() && date.isAfter(dayjs());
  }
}

export function IsDateValid(
  format?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [format],
      validator: IsDateValidConstraint,
    });
  };
}
