import { IsNumber, IsOptional, IsString, Matches, Max } from 'class-validator';

const ONE_KB = 1024;

export class ImageDto {
  @IsOptional()
  @IsNumber()
  @Max(ONE_KB, { message: '123' })
  size: number;

  @IsOptional()
  buffer: Buffer;

  @IsOptional()
  encoding: string;

  @IsOptional()
  @IsString()
  @Matches(/image\/(png)|(jpe?g)/)
  mimetype: string;

  @IsOptional()
  fieldname: string;

  @IsOptional()
  originalname: string;
}
