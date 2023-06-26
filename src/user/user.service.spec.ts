import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserController } from './user.controller';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from 'src/constants/enum';
import { UserRepository } from './repositories/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  let userId;
  const createUserDto: CreateUserDto = {
    name: 'test',
    email: 'test@gmail.com',
    age: 20,
    phone: '1234567890',
    role: UserRole.User,
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb+srv://minhtien:qvjqghcAskO7grKw@cluster0.xtc3ryh.mongodb.net/',
          {
            dbName: 'demo',
          },
        ),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
      ],
      controllers: [UserController],
      providers: [
        UserService,
        { provide: 'UserRepositoryInterface', useClass: UserRepository },
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should return a new user', async () => {
      const result = await service.create(createUserDto);
      userId = result._id;
      expect(result).toMatchObject(createUserDto);
      await service.delete(userId);
    });

    it('should throw an error when email is duplicated', async () => {
      try {
        userId = (await service.create(createUserDto))._id;
        await service.create({
          ...createUserDto,
          phone: '1234567891',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Email already exists!');
        expect(error.status).toBe(400);
      } finally {
        await service.delete(userId);
      }
    });

    it('should throw an error when phone is duplicated', async () => {
      try {
        userId = (await service.create(createUserDto))._id;
        await service.create({ ...createUserDto, email: 'test1@gmail.com ' });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Phone already exists!');
        expect(error.status).toBe(400);
      } finally {
        await service.delete(userId);
      }
    });
  });

  describe('updateUser', () => {
    beforeEach(async () => {
      userId = (await service.create(createUserDto))._id;
    });

    it('should return updated information', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'test after',
        role: UserRole.Manager,
      };

      expect(
        await service.update({ _id: userId }, updateUserDto),
      ).toMatchObject(updateUserDto);
    });

    afterEach(async () => {
      await service.delete(userId);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll({ isActive: true });
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('count');
      const items = result.items;
      expect(items).toBeInstanceOf(Array);
      expect(items[0]).toHaveProperty('name');
      expect(items[0]).toHaveProperty('email');
      expect(items[0]).toHaveProperty('age');
      expect(items[0]).toHaveProperty('phone');
      expect(items[0]).toHaveProperty('role');
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      userId = (await service.create(createUserDto))._id;
    });
    it('should return a user by id', async () => {
      const result = await service.findOne(userId);
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('age');
      expect(result).toHaveProperty('phone');
      expect(result).toHaveProperty('role');
    });

    afterEach(async () => {
      await service.delete(userId);
    });
  });

  describe('delete', () => {
    beforeEach(async () => {
      userId = (await service.create(createUserDto))._id;
    });

    it('should return true', async () => {
      try {
        expect(await service.delete(userId)).toBe(true);

        expect(await service.findOne(userId)).toThrow(NotFoundException);
      } catch (error) {
        expect(error.message).toBe('User not found');
      }
    });
  });
});
