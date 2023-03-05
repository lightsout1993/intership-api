import { PartialType } from '@nestjs/mapped-types';

import { ArtistCredentialsDto } from './artist-credentials.dto';

export class PartialArtistCredentialsDto extends PartialType(
  ArtistCredentialsDto,
) {}
