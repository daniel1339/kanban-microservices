// Interfaces para respuestas de autenticación
export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interfaces para tokens
export interface TokenPayload {
  sub: string; // user id
  email: string;
  username: string;
  iat?: number; // issued at
  exp?: number; // expiration
}

export interface RefreshTokenPayload {
  sub: string; // user id
  tokenId: string; // refresh token id
  iat?: number;
  exp?: number;
}

// Interfaces para servicios
export interface IAuthService {
  register(registerDto: any): Promise<AuthResponse>;
  login(loginDto: any): Promise<AuthResponse>;
  refreshToken(refreshToken: string): Promise<AuthResponse>;
  logout(userId: string, refreshToken: string): Promise<void>;
  validateUser(emailOrUsername: string, password: string): Promise<any>;
  generateTokens(user: any): Promise<{ accessToken: string; refreshToken: string }>;
}

// Interfaces para respuestas de error
export interface AuthError {
  message: string;
  code: string;
  statusCode: number;
}

// Interfaces para validación
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
} 