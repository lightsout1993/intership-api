import { ApiProperty } from '@nestjs/swagger';
import { ImageResponse } from 'src/image/swagger/ImageResponse.swagger';

export class PaintingResponse {
  @ApiProperty({ type: 'ObjectID', example: '60bf3ec1ee81da111fa6879f' })
  _id: string;

  @ApiProperty({ type: 'string', example: 'Moonlight' })
  name: string;

  @ApiProperty({
    type: 'string',
    example: '1895',
  })
  yearOfCreation: string;

  @ApiProperty({
    type: ImageResponse,
  })
  image: ImageResponse;
}
