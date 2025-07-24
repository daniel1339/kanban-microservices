import { ApiResponse } from '@nestjs/swagger';
import {
  AuthResponseSchema,
  RefreshTokenResponseSchema,
  UserProfileSchema,
  ValidateCredentialsResponseSchema,
  LogoutResponseSchema,
  ErrorResponseSchema,
  ValidationErrorSchema,
  RateLimitErrorSchema,
} from '../schemas/auth.schemas';
import {
  AuthResponseExample,
  UserProfileResponseExample,
  ValidateCredentialsResponseExample,
  LogoutResponseExample,
  LogoutAllResponseExample,
} from '../examples/auth.examples';
import {
  ValidationErrorExample,
  UnauthorizedErrorExample,
  ConflictErrorExample,
  NotFoundErrorExample,
  RateLimitErrorExample,
  ForbiddenErrorExample,
  InvalidTokenErrorExample,
} from '../examples/error.examples';

export const RegisterResponse = () =>
  ApiResponse({
    status: 201,
    description: 'Successful registration',
    type: AuthResponseSchema,
    content: { 'application/json': { example: AuthResponseExample.value } },
  });

export const LoginResponse = () =>
  ApiResponse({
    status: 200,
    description: 'Successful login',
    type: AuthResponseSchema,
    content: { 'application/json': { example: AuthResponseExample.value } },
  });

export const RefreshTokenResponse = () =>
  ApiResponse({
    status: 200,
    description: 'Successful refresh token',
    type: RefreshTokenResponseSchema,
    content: { 'application/json': { example: AuthResponseExample.value } },
  });

export const ProfileResponse = () =>
  ApiResponse({
    status: 200,
    description: 'User profile',
    type: UserProfileSchema,
    content: { 'application/json': { example: UserProfileResponseExample.value } },
  });

export const ValidateCredentialsResponse = () =>
  ApiResponse({
    status: 200,
    description: 'Credential validation',
    type: ValidateCredentialsResponseSchema,
    content: { 'application/json': { example: ValidateCredentialsResponseExample.value } },
  });

export const LogoutResponse = () =>
  ApiResponse({
    status: 200,
    description: 'Successful logout',
    type: LogoutResponseSchema,
    content: { 'application/json': { example: LogoutResponseExample.value } },
  });

export const LogoutAllResponse = () =>
  ApiResponse({
    status: 200,
    description: 'Logout all sessions',
    type: LogoutResponseSchema,
    content: { 'application/json': { example: LogoutAllResponseExample.value } },
  });

export const ValidationErrorResponse = () =>
  ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorSchema,
    content: { 'application/json': { example: ValidationErrorExample.value } },
  });

export const UnauthorizedErrorResponse = () =>
  ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseSchema,
    content: { 'application/json': { example: UnauthorizedErrorExample.value } },
  });

export const ConflictErrorResponse = () =>
  ApiResponse({
    status: 409,
    description: 'Conflict - Resource already exists',
    type: ErrorResponseSchema,
    content: { 'application/json': { example: ConflictErrorExample.value } },
  });

export const InvalidTokenErrorResponse = () =>
  ApiResponse({
    status: 401,
    description: 'Invalid token',
    type: ErrorResponseSchema,
    content: { 'application/json': { example: InvalidTokenErrorExample.value } },
  });

export const ForbiddenErrorResponse = () =>
  ApiResponse({
    status: 403,
    description: 'Forbidden - No permissions',
    type: ErrorResponseSchema,
    content: { 'application/json': { example: ForbiddenErrorExample.value } },
  });

export const NotFoundErrorResponse = () =>
  ApiResponse({
    status: 404,
    description: 'Not found - Resource not found',
    type: ErrorResponseSchema,
    content: { 'application/json': { example: NotFoundErrorExample.value } },
  });

export const RateLimitErrorResponse = () =>
  ApiResponse({
    status: 429,
    description: 'Too many requests - Rate limit exceeded',
    type: RateLimitErrorSchema,
    content: { 'application/json': { example: RateLimitErrorExample.value } },
  });

export const InternalServerErrorResponse = () =>
  ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseSchema,
    content: { 'application/json': { example: { statusCode: 500, message: 'Internal server error' } } },
  }); 