import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { ConfigService } from '@nestjs/config';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          // Fixed secure values
          const minLength = 8;
          const requireUppercase = true;
          const requireLowercase = true;
          const requireNumbers = true;
          const requireSpecialChars = true;

          // Check minimum length
          if (value.length < minLength) {
            return false;
          }

          // Check for uppercase letters
          if (requireUppercase && !/[A-Z]/.test(value)) {
            return false;
          }

          // Check for lowercase letters
          if (requireLowercase && !/[a-z]/.test(value)) {
            return false;
          }

          // Check for numbers
          if (requireNumbers && !/\d/.test(value)) {
            return false;
          }

          // Check for special characters
          if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
            return false;
          }

          // Check for common weak patterns
          const weakPatterns = [
            /123456/,
            /password/,
            /qwerty/,
            /admin/,
            /user/,
            /test/,
            /123/,
            /abc/,
          ];

          const lowerValue = value.toLowerCase();
          if (weakPatterns.some(pattern => pattern.test(lowerValue))) {
            return false;
          }

          // Check for repeated characters
          if (/(.)\1{2,}/.test(value)) {
            return false;
          }

          // Check for sequential characters
          if (/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(value)) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const requirements = [
            'at least 8 characters',
            'one uppercase letter',
            'one lowercase letter',
            'one number',
            'one special character',
          ];
          return `Password must contain ${requirements.join(', ')} and cannot contain weak patterns or repeated characters.`;
        },
      },
    });
  };
}

export function IsNotCommonPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotCommonPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          const commonPasswords = [
            'password',
            '123456',
            '123456789',
            'qwerty',
            'abc123',
            'password123',
            'admin',
            'letmein',
            'welcome',
            'monkey',
            'dragon',
            'master',
            'hello',
            'freedom',
            'whatever',
            'qazwsx',
            'trustno1',
            'jordan',
            'harley',
            'ranger',
            'joshua',
            'maggie',
            'password1',
            'robert',
            'daniel',
            'andrew',
            'lakers',
            'andrea',
            'buster',
            'jordan1',
            'superman',
            'harley1',
            'golfer',
            'tiger',
            'pookie',
            'charlie',
            'scooter',
            'welcome1',
            'fishing',
            'michael',
            'michelle',
            'love',
            'sunshine',
            'jordan23',
            'maggie1',
            'computer',
            'amanda',
            'summer',
            'hello1',
            'freedom1',
            'baseball',
            'buster1',
            'dragon1',
            'jordan2',
            'michael1',
            'michelle1',
            'andrea1',
            'andrew1',
            'robert1',
            'daniel1',
            'joshua1',
            'tiger1',
            'charlie1',
            'golfer1',
            'love1',
            'sunshine1',
            'computer1',
            'amanda1',
            'summer1',
            'baseball1',
            'dragon2',
            'jordan3',
            'michael2',
            'michelle2',
            'andrea2',
            'andrew2',
            'robert2',
            'daniel2',
            'joshua2',
            'tiger2',
            'charlie2',
            'golfer2',
            'love2',
            'sunshine2',
            'computer2',
            'amanda2',
            'summer2',
            'baseball2',
            'dragon3',
            'jordan4',
            'michael3',
            'michelle3',
            'andrea3',
            'andrew3',
            'robert3',
            'daniel3',
            'joshua3',
            'tiger3',
            'charlie3',
            'golfer3',
            'love3',
            'sunshine3',
            'computer3',
            'amanda3',
            'summer3',
            'baseball3',
            'dragon4',
            'jordan5',
            'michael4',
            'michelle4',
            'andrea4',
            'andrew4',
            'robert4',
            'daniel4',
            'joshua4',
            'tiger4',
            'charlie4',
            'golfer4',
            'love4',
            'sunshine4',
            'computer4',
            'amanda4',
            'summer4',
            'baseball4',
            'dragon5',
            'jordan6',
            'michael5',
            'michelle5',
            'andrea5',
            'andrew5',
            'robert5',
            'daniel5',
            'joshua5',
            'tiger5',
            'charlie5',
            'golfer5',
            'love5',
            'sunshine5',
            'computer5',
            'amanda5',
            'summer5',
            'baseball5',
          ];

          return !commonPasswords.includes(value.toLowerCase());
        },
        defaultMessage(args: ValidationArguments) {
          return 'Password is too common. Please choose a more unique password.';
        },
      },
    });
  };
} 