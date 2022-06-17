import { ApiProperty } from '@nestjs/swagger';
import { ImageBody } from 'src/image/swagger/ImageBody.swagger';

export class PaintingPutBody {
  @ApiProperty({})
  name: string;

  @ApiProperty({ type: 'string', example: '1478' })
  yearOfCreation: string;

  @ApiProperty({
    type: ImageBody,
  })
  image: ImageBody;
}
