import { ForbiddenException } from '@nestjs/common';
import { IpFilterGuard } from './ip-filter.guard';

describe('IpFilterGuard', () => {
  let guard: IpFilterGuard;
  let configService: any;

  beforeEach(() => {
    configService = {
      get: jest.fn(),
    };
    guard = new IpFilterGuard(configService);
  });

  it('denies access if IP is in blacklist', () => {
    configService.get.mockReturnValue({ blacklist: ['1.2.3.4'], whitelist: [] });
    const context = { switchToHttp: () => ({ getRequest: () => ({ headers: { 'x-forwarded-for': '1.2.3.4' } }) }) } as any;
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('denies access if IP is not in whitelist', () => {
    configService.get.mockReturnValue({ blacklist: [], whitelist: ['5.6.7.8'] });
    const context = { switchToHttp: () => ({ getRequest: () => ({ headers: { 'x-forwarded-for': '1.2.3.4' } }) }) } as any;
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('allows access if IP is in whitelist', () => {
    configService.get.mockReturnValue({ blacklist: [], whitelist: ['1.2.3.4'] });
    const context = { switchToHttp: () => ({ getRequest: () => ({ headers: { 'x-forwarded-for': '1.2.3.4' } }) }) } as any;
    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows access if IP is not in blacklist or whitelist', () => {
    configService.get.mockReturnValue({ blacklist: [], whitelist: [] });
    const context = { switchToHttp: () => ({ getRequest: () => ({ headers: { 'x-forwarded-for': '9.9.9.9' } }) }) } as any;
    expect(guard.canActivate(context)).toBe(true);
  });
}); 