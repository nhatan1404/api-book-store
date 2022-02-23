import { EntityId } from 'typeorm/repository/EntityId';
import { DeleteResult, FindConditions, FindManyOptions } from 'typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

export interface IBaseService<T> {
  findAll(
    optionsPaginate: IPaginationOptions,
    optionsQuery?: FindConditions<T> | FindManyOptions<T>,
  ): Promise<Pagination<T>>;

  findById(id: EntityId): Promise<T>;

  findByIds(id: [EntityId]): Promise<T[]>;

  store(data: any): Promise<T>;

  update(id: EntityId, data: any): Promise<T>;

  delete(id: EntityId): Promise<DeleteResult>;
}
