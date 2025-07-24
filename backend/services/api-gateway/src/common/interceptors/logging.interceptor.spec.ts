import { LoggingInterceptor } from './logging.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let context: ExecutionContext;
  let callHandler: CallHandler;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
    context = {
      switchToHttp: () => ({
        getRequest: () => ({ method: 'GET', url: '/test' }),
      }),
    } as any;
    callHandler = { handle: () => of('response') } as any;
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log method and url', (done) => {
    interceptor.intercept(context, callHandler).subscribe(() => {
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[Request] GET /test'));
      done();
    });
  });
}); 