import { ApiProperty } from '@nestjs/swagger';

export class AuthRefreshBody {
  @ApiProperty()
  fingerprint: string;

  @ApiProperty()
  refreshToken: string;
}
