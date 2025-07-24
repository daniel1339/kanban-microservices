import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ValidationPipe } from './validation.pipe';
import { IsString } from 'class-validator';

describe('ValidationPipe', () => {
  let pipe: ValidationPipe;

  beforeEach(() => {
    pipe = new ValidationPipe();
  });

  it('should return the object if validation passes', async () => {
    class TestDto { @IsString() name: string; }
    const value = { name: 'test' };
    const metadata: ArgumentMetadata = { type: 'body', metatype: TestDto };
    await expect(pipe.transform(value, metadata)).resolves.toEqual(expect.objectContaining(value));
  });

  it('should throw BadRequestException if validation fails', async () => {
    class TestDto { @IsString() name: string; }
    const value = { name: 123 };
    const metadata: ArgumentMetadata = { type: 'body', metatype: TestDto };
    await expect(pipe.transform(value, metadata)).rejects.toThrow(BadRequestException);
  });
}); 