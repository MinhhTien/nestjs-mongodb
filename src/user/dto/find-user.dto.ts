import { IsBoolean } from 'class-validator';
import { ToBoolean } from 'src/common/decorators/to-boolean.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationParams } from 'src/types/common.type';

export class FindUserDto extends PaginationParams {
  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  @ToBoolean()
  readonly isActive: boolean;
}
