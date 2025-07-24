import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: any;
  let authService: any;

  beforeEach(() => {
    configService = { get: jest.fn().mockReturnValue('secret') };
    authService = { validateUserById: jest.fn() };
    strategy = new JwtStrategy(configService, authService);
  });

  it('retorna usuario si es válido y activo', async () => {
    const payload = { sub: '1', email: 'a@b.com', iat: 1, exp: 2 };
    const user = { id: '1', email: 'a@b.com', username: 'test', roles: ['user'], isActive: true };
    authService.validateUserById.mockResolvedValue(user);
    await expect(strategy.validate(payload)).resolves.toMatchObject({ id: '1', email: 'a@b.com', username: 'test', roles: ['user'] });
  });

  it('lanza UnauthorizedException si el usuario no existe', async () => {
    const payload = { sub: '1', email: 'a@b.com', iat: 1, exp: 2 };
    authService.validateUserById.mockResolvedValue(null);
    await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
  });

  it('lanza UnauthorizedException si el usuario está inactivo', async () => {
    const payload = { sub: '1', email: 'a@b.com', iat: 1, exp: 2 };
    const user = { id: '1', email: 'a@b.com', username: 'test', roles: ['user'], isActive: false };
    authService.validateUserById.mockResolvedValue(user);
    await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
  });
}); 