import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { PrismaClient } from "@prisma/client";
import { Injectable, Logger } from "@nestjs/common";
import messages from "../configs/messages";

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueValidator implements ValidatorConstraintInterface {
  private readonly logger = new Logger(UniqueValidator.name);
  private static readonly prisma = new PrismaClient();

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [entityName, field] = args.constraints as [string, string];

    const model = (UniqueValidator.prisma as any)[entityName];
    if (!model?.findFirst) {
      this.logger.warn(messages.PRISMA_ENTITY_NOT_FOUND(entityName));
      return false;
    }

    try {
      const existingRecord = await model.findFirst({
        where: { [field]: value },
      });
      return !existingRecord;
    } catch (error) {
      this.logger.error(messages.PRISMA_VALIDATION_ERROR(entityName, field, value, error.message));
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const [entityName, field] = args.constraints as [string, string];
    return messages.UNIQUE_CONSTRAINT_FAILED(entityName, field, args.value);
  }
}

export function Unique<T extends string>(entity: T, field: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, field],
      validator: UniqueValidator,
    });
  };
}
