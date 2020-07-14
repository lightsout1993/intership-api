import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { IUser } from './user.interface';
import { User } from './schemas/user.schema';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly UserModel: Model<User>) {}

  async create(createUserDto: IUser): Promise<IUser> {
    try {
      const createdUser = new this.UserModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async register(authCredentialsDto: AuthCredentialsDto): Promise<IUser> {
    const { username, password } = authCredentialsDto;

    if (await this.findOne(username)) {
      throw new ConflictException('Username already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const userCredentials: IUser = { salt, username, password: passwordHash };
    return this.create(userCredentials);
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User | never> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne(username);

    if (!user) {
      throw new ConflictException('User with such username not found');
    }

    console.log(bcrypt);
    const passwordHash = await bcrypt.hash(password, user.salt);

    if (user.password !== passwordHash) {
      throw new ConflictException('Wrong password!');
    }

    return user;
  }

  async findOne(username: string): Promise<User> {
    return await this.UserModel.findOne({ username });
  }
}