import { ApiProperty } from '@nestjs/swagger';
import { ImageBody } from 'src/image/swagger/ImageBody.swagger';

export class PaintingBody {
  @ApiProperty({ type: 'string', example: 'Moonlight' })
  name: string;

  @ApiProperty({
    type: 'number',
    example: '1895',
  })
  yearOfCreation: string;

  @ApiProperty({
    type: ImageBody,
  })
  image: ImageBody;
}
