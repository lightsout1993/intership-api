import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginBody {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
