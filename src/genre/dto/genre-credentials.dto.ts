import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class GenreCredentialsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string;
}
