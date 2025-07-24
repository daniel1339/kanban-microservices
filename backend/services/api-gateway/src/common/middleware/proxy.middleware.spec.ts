import { ProxyMiddleware } from './proxy.middleware';

describe('ProxyMiddleware', () => {
  it('should call next()', () => {
    const middleware = new ProxyMiddleware();
    const req = {} as any;
    const res = {} as any;
    const next = jest.fn();
    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
  });
}); 