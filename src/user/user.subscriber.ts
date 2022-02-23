import { ConfigService } from '@nestjs/config';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { hash } from 'bcrypt';
import { User } from './user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface {
  constructor(
    connection: Connection,
    private readonly configService: ConfigService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo(): typeof User {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    const saltOrRounds: number = parseInt(
      this.configService.get<string>('saltRounds'),
    );
    const { password } = event.entity;

    event.entity.password = await hash(password, saltOrRounds);
  }
}
