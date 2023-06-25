import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  Max,
  Min,
  IsInt,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/constants/enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @MaxLength(20)
  @MinLength(4)
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of user', default: 'Your name' })
  readonly name: string;

  @IsInt()
  @IsNotEmpty()
  @Min(18)
  @Max(100)
  @ApiProperty({ description: 'Age of user', default: 18 })
  readonly age: number;

  @IsPhoneNumber('VN')
  @IsNotEmpty()
  @ApiProperty({ description: 'Phone number of user', default: '0987654321' })
  readonly phone: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email of user', default: 'user@gmail.com' })
  readonly email: string;

  @IsNotEmpty()
  @IsEnum(UserRole, { each: true })
  @ApiProperty({
    description: 'Role of user: Admin, Manager, User',
    enum: ['Admin', 'Manager', 'User'],
  })
  readonly role: UserRole;
}
