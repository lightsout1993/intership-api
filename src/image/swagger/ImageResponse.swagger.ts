import { ApiProperty } from '@nestjs/swagger';

export class ImageResponse {
  @ApiProperty({
    type: 'ObjectID',
    example: '60bf3ec1ee81da111fa68728',
  })
  _id: string;

  @ApiProperty({
    type: 'string',
    example: '/images/60bf3ec1ee81da111fa6871f/image.jpg',
  })
  src: string;

  @ApiProperty({
    type: 'string',
    example: '/images/60bf3ec1ee81da111fa6871f/image.webp',
  })
  webp: string;

  @ApiProperty({
    type: 'string',
    example: '/images/60bf3ec1ee81da111fa6871f/image2x.jpg',
  })
  src2x: string;

  @ApiProperty({
    type: 'string',
    example: '/images/60bf3ec1ee81da111fa6871f/image2x.webp',
  })
  webp2x: string;

  @ApiProperty({
    type: 'string',
    example: '/images/60bf3ec1ee81da111fa6871f/original.jpg',
  })
  original: string;
}
