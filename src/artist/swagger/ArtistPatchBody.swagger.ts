import { ApiProperty } from '@nestjs/swagger';

export class ArtistPatchBody {
  @ApiProperty({ type: 'string', example: '60bf3ec1ee81da111fa6871f' })
  mainPainting: string;
}
