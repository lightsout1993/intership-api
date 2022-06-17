import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterBody {
  @ApiProperty({
    type: 'string',
  })
  username: string;

  @ApiProperty({
    type: 'string',
  })
  password: string;

  @ApiProperty({ type: 'string' })
  fingerprint: string;
}
