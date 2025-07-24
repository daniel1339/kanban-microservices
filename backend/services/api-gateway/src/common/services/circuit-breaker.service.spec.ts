import { CircuitBreakerService } from './circuit-breaker.service';

describe('CircuitBreakerService', () => {
  let cb: CircuitBreakerService;
  const service = 'auth';
  const url = 'http://localhost:3001';

  beforeEach(() => {
    cb = new CircuitBreakerService();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be closed by default', () => {
    expect(cb.isOpen(service, url)).toBe(false);
  });

  it('should open after 3 failures', () => {
    cb.recordFailure(service, url);
    cb.recordFailure(service, url);
    expect(cb.isOpen(service, url)).toBe(false);
    cb.recordFailure(service, url);
    expect(cb.isOpen(service, url)).toBe(true);
  });

  it('should close after timeout', () => {
    cb.recordFailure(service, url);
    cb.recordFailure(service, url);
    cb.recordFailure(service, url);
    expect(cb.isOpen(service, url)).toBe(true);
    // Advance time by 31 seconds
    jest.advanceTimersByTime(31_000);
    expect(cb.isOpen(service, url)).toBe(false);
  });

  it('should reset on success', () => {
    cb.recordFailure(service, url);
    cb.recordFailure(service, url);
    cb.recordFailure(service, url);
    expect(cb.isOpen(service, url)).toBe(true);
    cb.recordSuccess(service, url);
    expect(cb.isOpen(service, url)).toBe(false);
  });

  it('should reset manually', () => {
    cb.recordFailure(service, url);
    cb.recordFailure(service, url);
    cb.recordFailure(service, url);
    expect(cb.isOpen(service, url)).toBe(true);
    cb.reset(service, url);
    expect(cb.isOpen(service, url)).toBe(false);
  });
}); 