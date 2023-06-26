import {
  Injectable,
  NotFoundException,
  Inject,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schema/user.schema';
import { BaseServiceAbstract } from '../common/services/base.abstract.service';
import { UserRepositoryInterface } from './repositories/user.interface.repository';

@Injectable()
export class UserService extends BaseServiceAbstract<UserDocument> {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {
    super(userRepository);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const createdUser = await this.userRepository.create(createUserDto);
      return createdUser;
    } catch (error) {
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

  async update({ _id: id }, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userRepository.update(
        { _id: id, isActive: true },
        updateUserDto,
      );
      if (!updatedUser) throw new NotFoundException('User not found');
      return updatedUser;
    } catch (error) {
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

  async findAll(
    { isActive = true },
    paginationParams = { skip: 0, limit: 10 },
    options?: object,
  ) {
    try {
      const { items, count } = await this.userRepository.findAll(
        { isActive },
        options,
        paginationParams,
      );
      return {
        items: items,
        count: count,
      };
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  async findOne(id: string): Promise<UserDocument> {
    try {
      const user = await this.userRepository.findOneByCondition({
        _id: id,
        isActive: true,
      });
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  async softDelete(id: string): Promise<boolean> {
    try {
      const result = await this.userRepository.softDelete(id);
      if (!result) throw new NotFoundException('User not found');
      return true;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.userRepository.permanentlyDelete(id);
      if (!result) throw new NotFoundException('User not found');
      return true;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
