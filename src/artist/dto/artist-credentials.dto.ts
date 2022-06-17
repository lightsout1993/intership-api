import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ArtistCredentialsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @MaxLength(255)
  yearsOfLife: string;

  @MaxLength(255)
  description: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsArray()
  @IsOptional()
  genres: string[];

  @IsString()
  @IsOptional()
  mainPainting?: string | null;
}
