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
  errors?: any[]; // Add errors array for validation details
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

    // Extract error message and details
    let message: string | string[];
    let errors: any[] | undefined;

    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      message = exceptionResponse.message as string | string[];
      
      // Handle validation errors specifically
      if (exception instanceof BadRequestException && Array.isArray(message)) {
        // This is a validation error from ValidationPipe
        message = 'Validation failed';
        
        // Extract validation errors from the exception response
        if ('message' in exceptionResponse && Array.isArray(exceptionResponse.message)) {
          errors = this.extractValidationErrors(exceptionResponse.message);
        }
      } else if ('errors' in exceptionResponse) {
        // Direct errors array (if already formatted)
        errors = exceptionResponse.errors as any[];
      }
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

    // Add validation errors if available
    if (errors && errors.length > 0) {
      errorResponse.errors = errors;
    }

    // Log the error
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

  private extractValidationErrors(validationMessages: string[]): any[] {
    const errors: any[] = [];
    
    // Map validation messages to field-specific errors
    validationMessages.forEach((message: string) => {
      // Extract field name from validation message
      const fieldMatch = this.extractFieldFromMessage(message);
      
      if (fieldMatch) {
        const { field, value, constraint } = fieldMatch;
        
        // Check if we already have an error for this field
        const existingError = errors.find(err => err.field === field);
        
        if (existingError) {
          // Add constraint to existing field error
          existingError.constraints[constraint] = message;
        } else {
          // Create new field error
          errors.push({
            field,
            value: value || 'undefined',
            constraints: {
              [constraint]: message
            }
          });
        }
      } else {
        // Fallback for messages we can't parse
        errors.push({
          field: 'unknown',
          value: 'undefined',
          constraints: {
            unknown: message
          }
        });
      }
    });
    
    return errors;
  }

  private extractFieldFromMessage(message: string): { field: string; value?: string; constraint: string } | null {
    // Common validation patterns
    const patterns = [
      // Email validation
      {
        regex: /^Email must be valid$/,
        field: 'email',
        constraint: 'isEmail'
      },
      // Username validation
      {
        regex: /^Username must be at least (\d+) characters$/,
        field: 'username',
        constraint: 'minLength'
      },
      {
        regex: /^Username cannot be longer than (\d+) characters$/,
        field: 'username',
        constraint: 'maxLength'
      },
      {
        regex: /^Username can only contain letters, numbers, and underscores$/,
        field: 'username',
        constraint: 'matches'
      },
      // Password validation
      {
        regex: /^Password must be at least (\d+) characters$/,
        field: 'password',
        constraint: 'minLength'
      },
      {
        regex: /^Password cannot be longer than (\d+) characters$/,
        field: 'password',
        constraint: 'maxLength'
      },
      {
        regex: /^Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character\.$/,
        field: 'password',
        constraint: 'matches'
      },
      // Password confirmation
      {
        regex: /^Password confirmation must be a string$/,
        field: 'passwordConfirmation',
        constraint: 'isString'
      },
      {
        regex: /^passwordConfirmation must match password$/,
        field: 'passwordConfirmation',
        constraint: 'match'
      },
      // Email or username (login)
      {
        regex: /^Email or username must be a string$/,
        field: 'emailOrUsername',
        constraint: 'isString'
      },
      {
        regex: /^Email or username cannot be longer than (\d+) characters$/,
        field: 'emailOrUsername',
        constraint: 'maxLength'
      },
      // Refresh token
      {
        regex: /^Refresh token must be a string$/,
        field: 'refreshToken',
        constraint: 'isString'
      },
      {
        regex: /^Refresh token is required$/,
        field: 'refreshToken',
        constraint: 'isNotEmpty'
      },
      // Generic string validation
      {
        regex: /^(.+) must be a string$/,
        field: (match: RegExpMatchArray) => match[1].toLowerCase().replace(/\s+/g, ''),
        constraint: 'isString'
      },
      // Generic length validation
      {
        regex: /^(.+) must be at least (\d+) characters$/,
        field: (match: RegExpMatchArray) => match[1].toLowerCase().replace(/\s+/g, ''),
        constraint: 'minLength'
      },
      {
        regex: /^(.+) cannot be longer than (\d+) characters$/,
        field: (match: RegExpMatchArray) => match[1].toLowerCase().replace(/\s+/g, ''),
        constraint: 'maxLength'
      }
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern.regex);
      if (match) {
        const field = typeof pattern.field === 'function' ? pattern.field(match) : pattern.field;
        return {
          field,
          constraint: pattern.constraint
        };
      }
    }

    return null;
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
} 