import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<boolean> {
    const updatedUser: UpdateWriteOpResult = await this.userModel.updateOne(
      { _id: id, isActive: true },
      updateUserDto,
    );
    if (!updatedUser.modifiedCount)
      throw new NotFoundException('User not found');
    return true;
  }

  async findAll(skip = 0, limit = 10) {
    const count = await this.userModel.countDocuments({}).exec();
    const data = await this.userModel.find().limit(limit).skip(skip).exec();
    return {
      data: data,
      total: count,
    };
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async deactivate(id: string): Promise<boolean> {
    const result: UpdateWriteOpResult = await this.userModel.updateOne(
      { _id: id, isActive: true },
      { isActive: false },
    );
    if (!result.modifiedCount) throw new NotFoundException('User not found');
    return true;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({
      _id: id,
      isActive: false,
    });
    if (!result.deletedCount) throw new NotFoundException('User not found');
    return true;
  }
}
