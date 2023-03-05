import { IsString } from 'class-validator';

export class RefreshCredentialsDto {
  @IsString()
  fingerprint: string;
}
