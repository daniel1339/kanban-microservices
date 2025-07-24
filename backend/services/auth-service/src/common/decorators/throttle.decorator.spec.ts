import { THROTTLE_KEY, Throttle, ThrottleLogin, ThrottleRegister, ThrottleRefresh, ThrottleValidate, ThrottleStrict, ThrottleLoose, SkipThrottle } from './throttle.decorator';
import 'reflect-metadata';

describe('Throttle Decorators', () => {
  it('should assign metadata with Throttle', () => {
    class Test {}
    Throttle({ ttl: 60, limit: 10, name: 'test' })(Test);
    const metadata = Reflect.getMetadata(THROTTLE_KEY, Test);
    expect(metadata).toEqual({ ttl: 60, limit: 10, name: 'test' });
  });

  it('ThrottleLogin should assign correct metadata', () => {
    class Test {}
    ThrottleLogin()(Test);
    const metadata = Reflect.getMetadata(THROTTLE_KEY, Test);
    expect(metadata).toMatchObject({ name: 'login' });
  });

  it('ThrottleRegister should assign correct metadata', () => {
    class Test {}
    ThrottleRegister()(Test);
    const metadata = Reflect.getMetadata(THROTTLE_KEY, Test);
    expect(metadata).toMatchObject({ name: 'register' });
  });

  it('ThrottleRefresh should assign correct metadata', () => {
    class Test {}
    ThrottleRefresh()(Test);
    const metadata = Reflect.getMetadata(THROTTLE_KEY, Test);
    expect(metadata).toMatchObject({ name: 'refresh' });
  });

  it('ThrottleValidate should assign correct metadata', () => {
    class Test {}
    ThrottleValidate()(Test);
    const metadata = Reflect.getMetadata(THROTTLE_KEY, Test);
    expect(metadata).toMatchObject({ name: 'validate' });
  });

  it('ThrottleStrict should assign correct metadata', () => {
    class Test {}
    ThrottleStrict()(Test);
    const metadata = Reflect.getMetadata(THROTTLE_KEY, Test);
    expect(metadata).toMatchObject({ name: 'strict' });
  });

  it('ThrottleLoose should assign correct metadata', () => {
    class Test {}
    ThrottleLoose()(Test);
    const metadata = Reflect.getMetadata(THROTTLE_KEY, Test);
    expect(metadata).toMatchObject({ name: 'loose' });
  });

  it('SkipThrottle should assign skipThrottle as true', () => {
    class Test {}
    SkipThrottle()(Test);
    const metadata = Reflect.getMetadata('skipThrottle', Test);
    expect(metadata).toBe(true);
  });
}); 