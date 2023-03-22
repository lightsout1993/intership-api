import { IsNumber, IsOptional, IsString, Matches, Max } from 'class-validator';

export class ImageDto {
  @IsOptional()
  @IsNumber()
  @Max(1024, { message: '123' })
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
