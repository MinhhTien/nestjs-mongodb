import { BaseRepositoryInterface } from 'src/common/repositories/base.interface.repository';
import { UserDocument } from '../schema/user.schema';

export type UserRepositoryInterface = BaseRepositoryInterface<UserDocument>;
