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
  Res,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { PaginationParams } from 'src/common/pagination.param';
import { Swagger } from 'src/common/decorators/swagger.decorator';

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
  async create(@Res() response, @Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Success',
        data: user,
      });
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        if (error.keyValue.email) {
          throw new BadRequestException('Email already exists!');
        }
        if (error.keyValue.phone) {
          throw new BadRequestException('Phone already exists!');
        }
      }
      throw new BadRequestException('User not created!');
    }
  }

  @Swagger(
    'Update a User',
    'Success',
    'Email already exists!, Phone already exists!, User not updated!',
  )
  @Put(':id')
  async update(
    @Res() response,
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.userService.update(id, updateUserDto);
      return response.status(HttpStatus.OK).json({
        message: 'Success',
        data: user,
      });
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        if (error.keyValue.email) {
          throw new BadRequestException('Email already exists!');
        }
        if (error.keyValue.phone) {
          throw new BadRequestException('Phone already exists!');
        }
      }
      throw new BadRequestException('User not updated!');
    }
  }

  @Swagger('Get many users', 'Success')
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
  async getAll(@Res() response, @Query() { skip, limit }: PaginationParams) {
    try {
      const users = await this.userService.findAll(skip, limit);
      return response.status(HttpStatus.OK).json({
        message: 'Success',
        data: users,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Swagger('Get one User', 'Success', undefined, 'User not found')
  @Get('/:id')
  async getOne(
    @Res() response,
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    try {
      const user = await this.userService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message: 'Success',
        data: user,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Swagger('Deactivate one User', 'Success', undefined, 'User not found')
  @Delete('/deactivate/:id')
  async deactivate(
    @Res() response,
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    try {
      const user = await this.userService.deactivate(id);
      return response.status(HttpStatus.OK).json({
        message: 'Success',
        data: user,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Swagger('Delete one User', 'Success', undefined, 'User not found')
  @Delete(':id')
  async delete(
    @Res() response,
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    try {
      const user = await this.userService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: 'Success',
        data: user,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
