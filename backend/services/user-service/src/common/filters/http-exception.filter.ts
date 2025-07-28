import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
  method: string;
  requestId?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  value: any;
  constraints: Record<string, string>;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract error message
    let message: string | string[];
    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      message = exceptionResponse.message as string | string[];
    } else {
      message = exception.message;
    }

    // Create structured error response
    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error: this.getErrorType(status),
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      requestId: request.headers['x-request-id'] as string,
    };

    // Handle validation errors specifically
    if (exception instanceof BadRequestException && Array.isArray(message)) {
      errorResponse.errors = this.extractValidationErrors(message);
    }

    // Error log
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${JSON.stringify(message)}`,
      exception.stack,
    );

    // Additional log for server errors
    if (status >= 500) {
      this.logger.error('Internal server error:', {
        url: request.url,
        method: request.method,
        userAgent: request.headers['user-agent'],
        ip: request.ip,
        body: request.body,
        stack: exception.stack,
      });
    }

    response.status(status).json(errorResponse);
  }

  private getErrorType(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'Unprocessable Entity';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'Too Many Requests';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal Server Error';
      case HttpStatus.SERVICE_UNAVAILABLE:
        return 'Service Unavailable';
      default:
        return 'Error';
    }
  }

  private extractValidationErrors(messages: string[]): ValidationError[] {
    const errors: ValidationError[] = [];
    
    for (const message of messages) {
      const field = this.extractFieldFromMessage(message);
      if (field) {
        const existingError = errors.find(error => error.field === field);
        if (existingError) {
          // Add constraint to existing error
          const constraintName = this.extractConstraintName(message);
          existingError.constraints[constraintName] = message;
        } else {
          // Create new error
          const constraintName = this.extractConstraintName(message);
          errors.push({
            field,
            value: undefined, // We don't have access to the original value here
            constraints: {
              [constraintName]: message,
            },
          });
        }
      }
    }
    
    return errors;
  }

  private extractFieldFromMessage(message: string): string | null {
    // Common patterns for field extraction
    const patterns = [
      /^(\w+) must be valid$/,
      /^(\w+) must be at least \d+ characters$/,
      /^(\w+) must contain at least/,
      /^(\w+) is required$/,
      /^(\w+) must be a string$/,
      /^(\w+) must be an email$/,
      /^(\w+) must be a valid UUID$/,
      /^(\w+) must be a positive number$/,
      /^(\w+) must be a valid date$/,
      /^(\w+) must be one of the following values/,
      /^(\w+) should not be empty$/,
      /^(\w+) must be longer than or equal to/,
      /^(\w+) must be shorter than or equal to/,
      /^(\w+) must be a valid enum value$/,
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  private extractConstraintName(message: string): string {
    // Extract constraint name from message
    if (message.includes('must be valid')) return 'isValid';
    if (message.includes('must be at least')) return 'minLength';
    if (message.includes('must contain at least')) return 'matches';
    if (message.includes('is required')) return 'isNotEmpty';
    if (message.includes('must be a string')) return 'isString';
    if (message.includes('must be an email')) return 'isEmail';
    if (message.includes('must be a valid UUID')) return 'isUuid';
    if (message.includes('must be a positive number')) return 'isPositive';
    if (message.includes('must be a valid date')) return 'isDate';
    if (message.includes('must be one of the following values')) return 'isIn';
    if (message.includes('should not be empty')) return 'isNotEmpty';
    if (message.includes('must be longer than or equal to')) return 'minLength';
    if (message.includes('must be shorter than or equal to')) return 'maxLength';
    if (message.includes('must be a valid enum value')) return 'isEnum';
    
    return 'validation';
  }
} 