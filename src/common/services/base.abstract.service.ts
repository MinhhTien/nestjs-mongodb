import { PaginationParams, FindAllResponse } from 'src/types/common.type';
import { BaseServiceInterface } from './base.interface.service';
import { BaseRepositoryInterface } from '../repositories/base.interface.repository';

export abstract class BaseServiceAbstract<T>
  implements BaseServiceInterface<T>
{
  constructor(private readonly repository: BaseRepositoryInterface<T>) {}

  async create(create_dto: T | any): Promise<T> {
    return await this.repository.create(create_dto);
  }

  async findAll(
    filter?: object,
    options?: object,
    paginationParams?: PaginationParams,
  ): Promise<FindAllResponse<T>> {
    return await this.repository.findAll(filter, options, paginationParams);
  }

  async findOne(id: string) {
    return await this.repository.findOneById(id);
  }

  async update(condition: object, updateDto: Partial<T>) {
    return await this.repository.update(condition, updateDto);
  }

  async softDelete(id: string) {
    return await this.repository.softDelete(id);
  }

  async remove(id: string) {
    return await this.repository.softDelete(id);
  }
}
