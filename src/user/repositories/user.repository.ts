import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from '../schema/user.schema';
import { UserRepositoryInterface } from './user.interface.repository';
import { BaseRepositoryAbstract } from 'src/common/repositories/base.abstract.repository';

@Injectable()
export class UserRepository
  extends BaseRepositoryAbstract<UserDocument>
  implements UserRepositoryInterface
{
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
