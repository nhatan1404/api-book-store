import { PinoLogger } from 'nestjs-pino';
import {
  BaseEntity,
  DeleteResult,
  FindConditions,
  FindManyOptions,
  Repository,
} from 'typeorm';
import { IBaseService } from './interfaces/base-service.interface';
import { EntityId } from 'typeorm/repository/EntityId';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

export class BaseService<T extends BaseEntity, R extends Repository<T>>
  implements IBaseService<T>
{
  protected readonly repository: R;
  protected readonly logger: PinoLogger;

  constructor(repository: R, logger: PinoLogger) {
    this.repository = repository;
    this.logger = logger;
  }

  async findAll(
    optionsPaginate: IPaginationOptions,
    optionsQuery?: FindConditions<T> | FindManyOptions<T>,
  ): Promise<Pagination<T>> {
    return paginate<T>(this.repository, optionsPaginate, optionsQuery);
  }

  async findById(id: EntityId): Promise<T> {
    return this.repository.findOne(id);
  }

  async findByIds(ids: EntityId[]): Promise<T[]> {
    return this.repository.findByIds(ids);
  }

  async store(data: any): Promise<T> {
    return this.repository.save(data);
  }

  async update(id: EntityId, data: any): Promise<T | null> {
    const result = await this.repository.update(id, data);
    if (result.affected > 0) {
      return this.findById(id);
    }
    return null;
  }

  async delete(id: EntityId): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
