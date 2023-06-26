import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { Swagger } from 'src/common/decorators/swagger.decorator';
import { FindUserDto } from './dto/find-user.dto';
import { CreatedResponse, OKResponse } from 'src/constants/response';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Swagger(
    'Create a new User',
    'Success',
    'Email already exists!, Phone already exists!, User not created!',
  )
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return new CreatedResponse('Success', user);
  }

  @Swagger(
    'Update a User',
    'Success',
    'Email already exists!, Phone already exists!, User not updated!',
  )
  @Put(':id')
  async update(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.update({ _id: id }, updateUserDto);
    return new OKResponse('Success', user);
  }

  @Swagger('Get many users', 'Success')
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'isActive',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Skip',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit',
  })
  @Get()
  async getAll(@Query() { isActive, skip, limit }: FindUserDto) {
    const users = await this.userService.findAll(
      { isActive },
      {
        skip,
        limit,
      },
    );
    return new OKResponse('Success', users);
  }

  @Swagger('Get one User', 'Success', undefined, 'User not found')
  @Get('/:id')
  async getOne(@Param('id', new ParseObjectIdPipe()) id: string) {
    const user = await this.userService.findOne(id);
    return new OKResponse('Success', user);
  }

  @Swagger('Delete one User', 'Success', undefined, 'User not found')
  @Delete('/:id')
  async delete(@Param('id', new ParseObjectIdPipe()) id: string) {
    try {
      const user = await this.userService.softDelete(id);
      return new OKResponse('Success', user);
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
