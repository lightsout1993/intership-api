import { ApiProperty } from '@nestjs/swagger';

export class GenreDeleteResponse {
  @ApiProperty({ type: 'ObjectID', example: '60bf3ec1ee81da111fa6871f' })
  _id: string;
}
