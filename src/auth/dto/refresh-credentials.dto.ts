import { IsString, Matches } from 'class-validator';
import { TOKEN_REGEXP } from '../../constants/auth.constants';

export class RefreshCredentialsDto {
  @IsString()
  fingerprint: string;

  @Matches(TOKEN_REGEXP)
  refreshToken: string;
}
