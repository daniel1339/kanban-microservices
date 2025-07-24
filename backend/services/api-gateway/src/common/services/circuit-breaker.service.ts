import { Injectable } from '@nestjs/common';

interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  open: boolean;
}

@Injectable()
export class CircuitBreakerService {
  // Map: serviceName|instanceUrl -> state
  private readonly states: Record<string, CircuitBreakerState> = {};
  private readonly failureThreshold = 3; // Number of failures before opening circuit
  private readonly openTimeout = 30_000; // 30 seconds before trying again

  private getKey(serviceName: string, url: string): string {
    return `${serviceName}|${url}`;
  }

  // Call this when a request to an instance fails
  recordFailure(serviceName: string, url: string) {
    const key = this.getKey(serviceName, url);
    const state = this.states[key] || { failures: 0, lastFailureTime: 0, open: false };
    state.failures += 1;
    state.lastFailureTime = Date.now();
    if (state.failures >= this.failureThreshold) {
      state.open = true;
    }
    this.states[key] = state;
  }

  // Call this when a request to an instance succeeds
  recordSuccess(serviceName: string, url: string) {
    const key = this.getKey(serviceName, url);
    this.states[key] = { failures: 0, lastFailureTime: 0, open: false };
  }

  // Check if the circuit is open for a given instance
  isOpen(serviceName: string, url: string): boolean {
    const key = this.getKey(serviceName, url);
    const state = this.states[key];
    if (!state) return false;
    if (!state.open) return false;
    // If open, check if timeout has passed
    if (Date.now() - state.lastFailureTime > this.openTimeout) {
      // Close the circuit after timeout
      this.reset(serviceName, url);
      return false;
    }
    return true;
  }

  // Reset the circuit breaker for an instance
  reset(serviceName: string, url: string) {
    const key = this.getKey(serviceName, url);
    this.states[key] = { failures: 0, lastFailureTime: 0, open: false };
  }
} 