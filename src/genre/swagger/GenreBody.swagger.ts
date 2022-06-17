import { ApiProperty } from '@nestjs/swagger';

export class GenreBody {
  @ApiProperty({ type: 'string', example: 'Realism' })
  name: string;
}
