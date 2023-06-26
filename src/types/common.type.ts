import { IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  readonly skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly limit?: number;
}

export type FindAllResponse<T> = { count: number; items: T[] };

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}
