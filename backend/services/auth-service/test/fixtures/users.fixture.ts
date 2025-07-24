import { RegisterDto, LoginDto, RefreshTokenDto } from '../../src/auth/dto';
import { AuthResponse, UserResponse } from '../../src/auth/interfaces/auth.interface';

export const mockUsers = {
  valid: {
    email: 'test@example.com',
    username: 'testuser',
    password: 'Secure2024!@',
    firstName: 'Test',
    lastName: 'User',
  },
  invalid: {
    email: 'invalid-email',
    username: 't', // Too short
    password: 'weak',
    firstName: 'Test',
    lastName: 'User',
  },
  duplicate: {
    email: 'existing@example.com',
    username: 'existinguser',
    password: 'Secure2024!@',
    firstName: 'Existing',
    lastName: 'User',
  },
};

export const mockRegisterDto: RegisterDto = {
  email: mockUsers.valid.email,
  username: mockUsers.valid.username,
  password: mockUsers.valid.password,
  passwordConfirmation: mockUsers.valid.password,
};

export const mockLoginDto: LoginDto = {
  emailOrUsername: mockUsers.valid.email,
  password: mockUsers.valid.password,
};

export const mockRefreshTokenDto: RefreshTokenDto = {
  refreshToken: 'valid-refresh-token-123',
};

export const mockUserResponse: UserResponse = {
  id: 'user-id-123',
  email: mockUsers.valid.email,
  username: mockUsers.valid.username,
  isVerified: true,
  createdAt: new Date('2024-01-15T10:00:00.000Z'),
  updatedAt: new Date('2024-01-15T10:00:00.000Z'),
};

export const mockAuthResponse: AuthResponse = {
  user: mockUserResponse,
  accessToken: 'valid-access-token-123',
  refreshToken: 'valid-refresh-token-123',
  expiresIn: 900,
};

export const mockJwtPayload = {
  id: 'user-id-123',
  email: mockUsers.valid.email,
  username: mockUsers.valid.username,
  roles: ['user'],
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 900,
};

export const mockInvalidCredentials = {
  emailOrUsername: 'nonexistent@example.com',
  password: 'wrongpassword',
};

export const mockValidationErrors = {
  email: ['Email must be valid'],
  username: ['Username must be at least 3 characters'],
  password: ['Password must be at least 8 characters'],
}; 