import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: any;

  beforeEach(() => {
    authService = { validateUser: jest.fn() };
    strategy = new LocalStrategy(authService);
  });

  it('retorna usuario si es válido y activo', async () => {
    const user = { id: '1', email: 'a@b.com', username: 'test', is_active: true };
    authService.validateUser.mockResolvedValue(user);
    await expect(strategy.validate('a@b.com', 'pass')).resolves.toBe(user);
  });

  it('lanza UnauthorizedException si las credenciales son inválidas', async () => {
    authService.validateUser.mockResolvedValue(null);
    await expect(strategy.validate('a@b.com', 'wrong')).rejects.toThrow(UnauthorizedException);
  });

  it('lanza UnauthorizedException si el usuario está inactivo', async () => {
    const user = { id: '1', email: 'a@b.com', username: 'test', is_active: false };
    authService.validateUser.mockResolvedValue(user);
    await expect(strategy.validate('a@b.com', 'pass')).rejects.toThrow(UnauthorizedException);
  });
}); 