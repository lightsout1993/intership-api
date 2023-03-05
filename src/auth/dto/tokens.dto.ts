import { Matches } from 'class-validator';

import { TOKEN_REGEXP } from '../../constants/auth.constants';

export class TokensDto {
  @Matches(TOKEN_REGEXP)
  accessToken: string;

  @Matches(TOKEN_REGEXP)
  refreshToken: string;
}
