import { ApiProperty } from '@nestjs/swagger';
import { ImageResponse } from 'src/image/swagger/ImageResponse.swagger';

export class ArtistResponse {
  @ApiProperty({
    type: 'ObjectID[]',
    example: '[60bf3ec1ee81da111fa6871f, 60bf3ec1ee81da111fa6879f]',
  })
  genres: string[];

  @ApiProperty({ type: 'ObjectID', example: '60bf3ec1ee81da111fa6879f' })
  _id: string;

  @ApiProperty({ type: 'string', example: 'Ivan', description: 'ФИО' })
  name: string;

  @ApiProperty({ type: 'string' })
  description: string;

  @ApiProperty({
    type: 'string',
    example: '5 July 1606 – 4 October 1669',
    description: 'Годы жизни',
  })
  yearsOfLife: string;

  @ApiProperty({
    type: ImageResponse,
  })
  avatar: ImageResponse;
}
