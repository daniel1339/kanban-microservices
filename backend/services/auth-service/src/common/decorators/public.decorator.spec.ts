import { IS_PUBLIC_KEY, Public } from './public.decorator';
import 'reflect-metadata';

describe('Public Decorator', () => {
  it('should assign isPublic as metadata', () => {
    class Test {}
    Public()(Test);
    const metadata = Reflect.getMetadata(IS_PUBLIC_KEY, Test);
    expect(metadata).toBe(true);
  });
}); 