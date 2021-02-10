import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ArtistCredentialsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  yearsOfLife: string;

  @IsString()
  description: string;
}
