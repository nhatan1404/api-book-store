import { PinoLogger } from 'nestjs-pino';
import { UserRepository } from './user.repository';
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { User } from './user.entity';
import { UserStatus } from './enum/user-status.enum';

@Injectable()
export class UserService extends BaseService<User, UserRepository> {
  constructor(repository: UserRepository, logger: PinoLogger) {
    super(repository, logger);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ email });
  }

  findInactiveUser(): Promise<User[]> {
    return this.repository
      .createQueryBuilder()
      .where('status :status', { status: UserStatus.INACTIVE })
      .getMany();
  }
}
