import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Token, TokenSchema } from './schemas/token.schema';
import { TokenService } from './token.service';

@Module({
  exports: [TokenService],
  providers: [TokenService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
})
export class TokenModule {}
