import { ApiProperty } from '@nestjs/swagger';

export class GenreResponse {
  @ApiProperty({ type: 'ObjectID', example: '60bf3ec1ee81da111fa6871f' })
  _id: string;

  @ApiProperty({ type: 'string', example: 'Realism' })
  name: string;
}
