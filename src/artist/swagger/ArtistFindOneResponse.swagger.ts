import { ApiProperty } from '@nestjs/swagger';

export class ArtistFindOneResponse {
  @ApiProperty({
    type: 'ObjectID[]',
    example: '[60bf3ec1ee81da111fa6871f, 60bf3ec1ee81da111fa6879f]',
  })
  paintings: string[];

  @ApiProperty({
    type: 'ObjectID[]',
    example: '[60bf3ec1ee81da111fa6871f, 60bf3ec1ee81da111fa6879f]',
  })
  genres: string[];

  @ApiProperty({ type: 'ObjectID', example: '60bf3ec1ee81da111fa6871f' })
  _id: string;

  @ApiProperty({
    type: 'string',
    example: 'Ivan',
  })
  name: string;

  @ApiProperty({
    type: 'string',
    example: '5 July 1606 – 4 October 1669',
  })
  yearsOfLife: string;

  @ApiProperty({
    type: 'string',
  })
  description: string;

  @ApiProperty({
    type: 'ObjectID',
    example: '60bf3ec1ee81da111fa68728',
  })
  avatar: string;
}
