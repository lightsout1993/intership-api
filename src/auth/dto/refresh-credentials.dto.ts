import { IsString } from 'class-validator';

export class RefreshCredentialsDto {
  @IsString()
  fingerprint: string;

  @IsString()
  refreshToken: string;
}
