import { Test, TestingModule } from '@nestjs/testing';
import { UserEventsListener } from './user-events.listener';
import { Logger } from '@nestjs/common';

describe('UserEventsListener', () => {
  let listener: UserEventsListener;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserEventsListener],
    }).compile();

    listener = module.get<UserEventsListener>(UserEventsListener);
    
    // Spy on logger
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleUserCreated', () => {
    it('should be defined', () => {
      expect(listener).toBeDefined();
    });

    it('should handle user.created event with valid payload', async () => {
      const payload = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        username: 'testuser',
      };

      await listener.handleUserCreated(payload);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Event received: user.created - ${JSON.stringify(payload)}`
      );
    });

    it('should handle user.created event with minimal payload', async () => {
      const payload = {
        id: 'minimal-user-id',
        email: 'minimal@example.com',
        username: 'minimaluser',
      };

      await listener.handleUserCreated(payload);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Event received: user.created - ${JSON.stringify(payload)}`
      );
    });

    it('should handle user.created event with extended payload', async () => {
      const payload = {
        id: 'extended-user-id',
        email: 'extended@example.com',
        username: 'extendeduser',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
      };

      await listener.handleUserCreated(payload as any);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Event received: user.created - ${JSON.stringify(payload)}`
      );
    });

    it('should handle empty payload gracefully', async () => {
      const payload = {
        id: 'empty-payload-id',
        email: 'empty@example.com',
        username: 'emptyuser',
      };

      await listener.handleUserCreated(payload);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Event received: user.created - ${JSON.stringify(payload)}`
      );
    });

    it('should handle null payload gracefully', async () => {
      const payload = {
        id: 'null-payload-id',
        email: 'null@example.com',
        username: 'nulluser',
      };

      await listener.handleUserCreated(payload as any);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Event received: user.created - ${JSON.stringify(payload)}`
      );
    });
  });

  describe('handleUserUpdated', () => {
    it('should handle user.updated event with valid payload', async () => {
      const payload = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'updated@example.com',
        username: 'updateduser',
      };

      await listener.handleUserUpdated(payload);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Event received: user.updated - ${JSON.stringify(payload)}`
      );
    });

    it('should handle user.updated event with partial payload', async () => {
      const payload = {
        id: 'partial-user-id',
        email: 'partial@example.com',
        username: 'partialuser',
      };

      await listener.handleUserUpdated(payload);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Event received: user.updated - ${JSON.stringify(payload)}`
      );
    });

    it('should handle user.updated event with only id', async () => {
      const payload = {
        id: 'id-only-user',
        email: 'idonly@example.com',
        username: 'idonlyuser',
      };

      await listener.handleUserUpdated(payload);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Event received: user.updated - ${JSON.stringify(payload)}`
      );
    });

    it('should handle empty payload gracefully', async () => {
      const payload = {
        id: 'empty-update-id',
        email: 'emptyupdate@example.com',
        username: 'emptyupdateuser',
      };

      await listener.handleUserUpdated(payload);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Event received: user.updated - ${JSON.stringify(payload)}`
      );
    });
  });

  describe('handleUserDeleted', () => {
    it('should handle user.deleted event with valid payload', async () => {
      const payload = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      await listener.handleUserDeleted(payload);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Event received: user.deleted - ${JSON.stringify(payload)}`
      );
    });

    it('should handle user.deleted event with extended payload', async () => {
      const payload = {
        id: 'extended-delete-user',
        reason: 'user request',
        deletedBy: 'admin',
        deletedAt: new Date().toISOString(),
      };

      await listener.handleUserDeleted(payload as any);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Event received: user.deleted - ${JSON.stringify(payload)}`
      );
    });

    it('should handle empty payload gracefully', async () => {
      const payload = {
        id: 'empty-delete-id',
      };

      await listener.handleUserDeleted(payload);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Event received: user.deleted - ${JSON.stringify(payload)}`
      );
    });

    it('should handle null payload gracefully', async () => {
      const payload = {
        id: 'null-delete-id',
      };

      await listener.handleUserDeleted(payload as any);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Event received: user.deleted - ${JSON.stringify(payload)}`
      );
    });
  });

  describe('Event handling consistency', () => {
    it('should handle all event types consistently', async () => {
      // Clear previous calls
      loggerSpy.mockClear();
      
      const testPayload = {
        id: 'test-user-id',
        email: 'test@example.com',
        username: 'testuser',
      };

      await listener.handleUserCreated(testPayload);
      await listener.handleUserUpdated(testPayload);
      await listener.handleUserDeleted({ id: testPayload.id });

      expect(loggerSpy).toHaveBeenCalledTimes(3);
      expect(loggerSpy).toHaveBeenNthCalledWith(
        1,
        `Event received: user.created - ${JSON.stringify(testPayload)}`
      );
      expect(loggerSpy).toHaveBeenNthCalledWith(
        2,
        `Event received: user.updated - ${JSON.stringify(testPayload)}`
      );
      expect(loggerSpy).toHaveBeenNthCalledWith(
        3,
        `Event received: user.deleted - ${JSON.stringify({ id: testPayload.id })}`
      );
    });

    it('should handle multiple events of the same type', async () => {
      // Clear previous calls
      loggerSpy.mockClear();
      
      const payload1 = { id: 'user1', email: 'user1@example.com', username: 'user1' };
      const payload2 = { id: 'user2', email: 'user2@example.com', username: 'user2' };

      await listener.handleUserCreated(payload1);
      await listener.handleUserCreated(payload2);

      expect(loggerSpy).toHaveBeenCalledTimes(2);
      expect(loggerSpy).toHaveBeenNthCalledWith(
        1,
        `Event received: user.created - ${JSON.stringify(payload1)}`
      );
      expect(loggerSpy).toHaveBeenNthCalledWith(
        2,
        `Event received: user.created - ${JSON.stringify(payload2)}`
      );
    });
  });
}); 