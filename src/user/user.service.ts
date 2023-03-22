import type { Model } from 'mongoose';

import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';

import { AuthCredentialsDto } from '@/auth/dto/auth-credentials.dto';

import type { IUser } from './user.interface';

import { User } from './schemas/user.schema';
import { getDemoUserId } from './utils/user.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
  ) {}

  async create(createUserDto: IUser): Promise<User> {
    const user = new this.UserModel(createUserDto);
    return user.save();
  }

  async register(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;

    const user = await this.findByUsername(username);

    if (user) {
      throw new ConflictException('Username already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    return this.create({ salt, username, password: passwordHash });
  }

  async validateUserPassword(
    username: string,
    password: string,
  ): Promise<User | never> {
    const user = await this.findByUsername(username);

    if (!user) {
      throw new ConflictException('User with such username not found');
    }

    const passwordHash = await bcrypt.hash(password, user.salt);

    if (user.password !== passwordHash) {
      throw new ConflictException('Wrong password!');
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    return this.UserModel.findOne({ username }).exec();
  }

  async getDemoUser(): Promise<User | never> {
    try {
      const _id = getDemoUserId();

      return this.UserModel.findById(_id);
    } catch {
      throw new NotFoundException(
        'Demonstration user not found. Please, start seeder!',
      );
    }
  }
}
