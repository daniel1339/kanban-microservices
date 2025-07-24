import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
@Injectable()
export class UserEventsListener {
  private readonly logger = new Logger(UserEventsListener.name);

  @OnEvent('user.created')
  async handleUserCreated(payload: { id: string; email: string; username: string }) {
    this.logger.log(`Event received: user.created - ${JSON.stringify(payload)}`);
    // TODO: Create user profile, initialize data, etc.
  }

  @OnEvent('user.updated')
  async handleUserUpdated(payload: { id: string; email: string; username: string }) {
    this.logger.log(`Event received: user.updated - ${JSON.stringify(payload)}`);
    // TODO: Update user profile, sync data, etc.
  }

  @OnEvent('user.deleted')
  async handleUserDeleted(payload: { id: string }) {
    this.logger.log(`Event received: user.deleted - ${JSON.stringify(payload)}`);
    // TODO: Delete user profile, clean up data, etc.
  }
} 