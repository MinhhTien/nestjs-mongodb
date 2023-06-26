import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from 'src/constants/enum';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const createUserDto: CreateUserDto = {
    name: 'test',
    email: 'test@gmail.com',
    age: 20,
    phone: '1234567890',
    role: UserRole.User,
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<UserController>(UserController);
    service = moduleRef.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user = { id: 1, ...createUserDto };
      jest.spyOn(service, 'create').mockResolvedValue(user as UserDocument);

      const data = await controller.create(createUserDto);
      expect(data.statusCode).toBe(HttpStatus.CREATED);
      expect(data.message).toBe('Success');
      expect(data.result).toBe(user);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = {
        name: 'John',
        age: 30,
        phone: '1234567890',
        email: 'john@example.com',
        role: UserRole.User,
      } as UserDocument;
      jest.spyOn(service, 'update').mockResolvedValue(user as UserDocument);

      const data = await controller.update('1', user);
      expect(data.statusCode).toBe(HttpStatus.OK);
      expect(data.message).toBe('Success');
      expect(data.result).toBe(user);
    });
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const result = {
        items: [{ name: 'John' }, { name: 'Doe' }] as UserDocument[],
        count: 2,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      const data = await controller.getAll({
        isActive: true,
        skip: 0,
        limit: 10,
      });
      expect(data.statusCode).toBe(HttpStatus.OK);
      expect(data.message).toBe('Success');
      expect(data.result).toHaveProperty('items');
      expect(data.result).toHaveProperty('count');
    });
  });

  describe('findOne', () => {
    it('should return an item by id', async () => {
      const result = { id: 1, name: 'Item 1' } as UserDocument;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      const data = await controller.getOne('1');
      expect(data.statusCode).toBe(HttpStatus.OK);
      expect(data.message).toBe('Success');
      expect(data.result).toBe(result);
    });
  });

  describe('delete', () => {
    it('should delete a user by id', async () => {
      jest.spyOn(service, 'softDelete').mockResolvedValue(true);

      expect(await controller.delete('1')).toBeTruthy();
    });
  });
});
