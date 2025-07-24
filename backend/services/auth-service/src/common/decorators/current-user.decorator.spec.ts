import { ExecutionContext } from '@nestjs/common';
import { currentUserFactory } from './current-user.decorator';

describe('CurrentUser Decorator', () => {
  it('should return the complete user if no data is passed', () => {
    const mockUser = { sub: '1', email: 'a@b.com', username: 'test' };
    const ctx = { switchToHttp: () => ({ getRequest: () => ({ user: mockUser }) }) } as any as ExecutionContext;
    expect(currentUserFactory(undefined, ctx)).toEqual(mockUser);
  });

  it('should return the requested field if data is passed', () => {
    const mockUser = { sub: '1', email: 'a@b.com', username: 'test' };
    const ctx = { switchToHttp: () => ({ getRequest: () => ({ user: mockUser }) }) } as any as ExecutionContext;
    expect(currentUserFactory('email', ctx)).toBe('a@b.com');
  });
}); 