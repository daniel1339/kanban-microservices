import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let context: Partial<ExecutionContext>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;
    guard = new RolesGuard(reflector);
    context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn(),
    };
  });

  function setRequestUser(user: any) {
    (context.switchToHttp as jest.Mock).mockReturnValue({ getRequest: () => ({ user }) });
  }

  it('allows access if no roles are required', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);
    setRequestUser({ role: 'user' });
    expect(guard.canActivate(context as ExecutionContext)).toBe(true);
  });

  it('throws ForbiddenException if there is no user', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    setRequestUser(undefined);
    expect(() => guard.canActivate(context as ExecutionContext)).toThrow(ForbiddenException);
  });

  it('throws ForbiddenException if user does not have the required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    setRequestUser({ role: 'user' });
    expect(() => guard.canActivate(context as ExecutionContext)).toThrow(ForbiddenException);
  });

  it('allows access if user has the required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    setRequestUser({ role: 'admin' });
    expect(guard.canActivate(context as ExecutionContext)).toBe(true);
  });
}); 