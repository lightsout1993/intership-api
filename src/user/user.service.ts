import type { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import type { IUser } from './user.interface';

import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly UserModel: Model<User>) {}

  async create(createUserDto: IUser): Promise<User> {
    try {
      const user = new this.UserModel(createUserDto);
      return await user.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async register(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;

    if (await this.findOne(username)) {
      throw new ConflictException('Username already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const userCredentials: IUser = { salt, username, password: passwordHash };
    return this.create(userCredentials);
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<IUser | never> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne(username);

    if (!user) {
      throw new ConflictException('User with such username not found');
    }

    const passwordHash = await bcrypt.hash(password, user.salt);

    if (user.password !== passwordHash) {
      throw new ConflictException('Wrong password!');
    }

    return user;
  }

  async findOne(username: string): Promise<User | null> {
    return await this.UserModel.findOne({ username }).exec();
  }

  async getDemoUser(): Promise<User> {
    return await this.UserModel.findOne({ _id: Types.ObjectId(process.env.DEMO_USER_ID) }).exec();
  }
}
