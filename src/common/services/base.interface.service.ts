import { FindAllResponse, PaginationParams } from 'src/types/common.type';

export interface Write<T> {
  create(item: T | any): Promise<T>;
  update(condition: object, item: Partial<T>): Promise<T>;
  softDelete(id: string): Promise<boolean>;
  remove(id: string): Promise<boolean>;
}

export interface Read<T> {
  findAll(
    filter?: object,
    options?: object,
    paginationParams?: PaginationParams,
  ): Promise<FindAllResponse<T>>;
  findOne(id: string): Promise<T>;
}

export interface BaseServiceInterface<T> extends Write<T>, Read<T> {}
