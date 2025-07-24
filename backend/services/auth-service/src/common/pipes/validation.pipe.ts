import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  private readonly logger = new Logger(ValidationPipe.name);

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      whitelist: true, // Remove non-decorated properties
      forbidNonWhitelisted: true, // Throw error if there are non-allowed properties
      forbidUnknownValues: true, // Throw error if there are unknown values
      transform: true, // Transform types automatically
      transformOptions: {
        enableImplicitConversion: true, // Allow implicit conversion
      },
    });

    if (errors.length > 0) {
      const errorMessages = this.formatValidationErrors(errors);
      this.logger.warn(`Validation failed: ${JSON.stringify(errorMessages)}`);
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatValidationErrors(errors: any[]): any[] {
    return errors.map(error => ({
      field: error.property,
      value: error.value,
      constraints: error.constraints,
      children: error.children ? this.formatValidationErrors(error.children) : [],
    }));
  }
} 