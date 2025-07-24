import { CorsMiddleware } from './cors.middleware';

describe('CorsMiddleware', () => {
  let middleware: CorsMiddleware;
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    middleware = new CorsMiddleware();
    req = { method: 'GET' };
    res = { header: jest.fn(), sendStatus: jest.fn() };
    next = jest.fn();
  });

  it('should set CORS headers', () => {
    middleware.use(req, res, next);
    expect(res.header).toHaveBeenCalledWith('Access-Control-Allow-Origin', expect.any(String));
    expect(res.header).toHaveBeenCalledWith('Access-Control-Allow-Methods', expect.any(String));
    expect(res.header).toHaveBeenCalledWith('Access-Control-Allow-Headers', expect.any(String));
    expect(next).toHaveBeenCalled();
  });

  it('should respond 204 for OPTIONS', () => {
    req.method = 'OPTIONS';
    middleware.use(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(204);
    expect(next).not.toHaveBeenCalled();
  });
}); 