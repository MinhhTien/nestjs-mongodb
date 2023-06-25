import { PaginationParams } from 'src/common/pagination.param';

export class FindUserDto extends PaginationParams {
  readonly isActive?: boolean;
  readonly keyword?: string;
}
