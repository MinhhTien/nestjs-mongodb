import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { FindAllResponse, PaginationParams } from 'src/types/common.type';
import { BaseRepositoryInterface } from './base.interface.repository';

export abstract class BaseRepositoryAbstract<T>
  implements BaseRepositoryInterface<T>
{
  protected constructor(private readonly model: Model<T>) {
    this.model = model;
  }

  async create(dto: T | any): Promise<T> {
    const createdData = await this.model.create(dto);
    return createdData.save();
  }

  async findOneById(id: string): Promise<T> {
    const item = await this.model.findById(id);
    return item;
  }

  async findOneByCondition(condition = {}): Promise<T> {
    return await this.model
      .findOne({
        ...condition,
      })
      .exec();
  }

  async findAll(
    condition: FilterQuery<T>,
    options?: QueryOptions<T>,
    paginationParams?: PaginationParams,
  ): Promise<FindAllResponse<T>> {
    const [count, items] = await Promise.all([
      this.model.count({ ...condition }),
      this.model
        .find(condition, options?.projection, options)
        .limit(paginationParams.limit ?? 10)
        .skip(paginationParams.skip ?? 0),
    ]);
    return {
      count,
      items,
    };
  }

  async update(condition: object, dto: Partial<T>): Promise<T> {
    const result = await this.model.findOneAndUpdate(condition, dto, {
      new: true,
    });
    return result;
  }

  async softDelete(id: string): Promise<boolean> {
    const deleteItem = await this.model.findById(id);
    if (!deleteItem) {
      return false;
    }

    return !!(await this.model
      .findByIdAndUpdate<T>(id, { isActive: false })
      .exec());
  }

  async permanentlyDelete(id: string): Promise<boolean> {
    const deleteItem = await this.model.findById(id);
    if (!deleteItem) {
      return false;
    }
    return !!(await this.model.findByIdAndDelete(id));
  }
}
