import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({
    type: 'string',
  })
  accessToken: string;

  @ApiProperty({
    type: 'string',
  })
  refreshToken: string;
}
