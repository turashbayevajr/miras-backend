import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PrismaClient } from '@prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import messages from '../configs/messages';
import { validate as isUUID } from 'uuid';

@ValidatorConstraint({ async: true })
@Injectable()
export class ExistsValidator implements ValidatorConstraintInterface {
  private readonly logger = new Logger(ExistsValidator.name);
  private static readonly prisma = new PrismaClient();

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const entityName = args.constraints[0] as string;

    if (!isUUID(value)) {
      this.logger.warn(messages.INVALID_ID(value));
      return false;
    }

    const model = (ExistsValidator.prisma as any)[entityName];
    if (!model?.findFirst) {
      this.logger.warn(messages.PRISMA_ENTITY_NOT_FOUND(entityName));
      return false;
    }

    try {
      const record = await model.findFirst({
        where: {
          id: value,
        },
      });

      if (!record) {
        this.logger.warn(messages.NOT_FOUND_BY_ID(entityName, value));
      }

      return !!record;
    } catch (error) {
      this.logger.error(
        messages.PRISMA_VALIDATION_ERROR(
          entityName,
          'id',
          value,
          error.message,
        ),
      );
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const entityName = args.constraints[0] as string;
    return messages.INVALID_RELATION(entityName, args.value);
  }
}

export function Exists<T extends string>(
  entity: T,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity],
      validator: ExistsValidator,
    });
  };
}
