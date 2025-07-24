import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let context: ExecutionContext;

  function createHttpArgumentsHostMock(req: any = { headers: {} }) {
    return {
      getRequest: () => req,
      getResponse: () => undefined as any,
      getNext: () => undefined as any,
    };
  }

  beforeEach(() => {
    guard = new JwtAuthGuard();
    context = {
      switchToHttp: () => createHttpArgumentsHostMock(),
    } as unknown as ExecutionContext;
  });

  it('should accept valid mock token in test mode', () => {
    process.env.NODE_ENV = 'test';
    const req: any = { headers: { authorization: 'Bearer valid-jwt-token' } };
    context.switchToHttp = () => createHttpArgumentsHostMock(req);
    const result = guard.handleRequest(null, null, null, context);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('username');
    expect(result).toHaveProperty('sub');
  });

  it('should throw UnauthorizedException if no user and not test', () => {
    process.env.NODE_ENV = 'production';
    expect(() => guard.handleRequest(null, null, null, context)).toThrow(UnauthorizedException);
  });

  it('should return user if valid', () => {
    process.env.NODE_ENV = 'production';
    const user = { id: '1', email: 'a@b.com' };
    const result = guard.handleRequest(null, user, null, context);
    expect(result).toBe(user);
  });
}); 