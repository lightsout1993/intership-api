import { ApiProperty } from '@nestjs/swagger';

export class ImageBody {
  @ApiProperty()
  size: number;

  @ApiProperty()
  buffer: Buffer;

  @ApiProperty()
  encoding: string;

  @ApiProperty()
  mimetype: string;

  @ApiProperty()
  fieldname: string;

  @ApiProperty()
  originalname: string;
}
