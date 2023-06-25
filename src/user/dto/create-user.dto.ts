import { IsString, IsNumber, IsNotEmpty, MaxLength } from 'class-validator';
import { UserRole } from 'src/constants/enum';

export class CreateUserDto {
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly age: number;

  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly role: UserRole;
}
