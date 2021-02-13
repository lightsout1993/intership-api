import {
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

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
}