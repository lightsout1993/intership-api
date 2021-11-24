import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsOptional,
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
/* 
  TODO: Сделать поле country обязательным после того как будет решена проблема с выбором страны при создании артиста
*/

  @IsString()
  @IsOptional()
  country?: string;

  @IsArray()
  @IsOptional()
  genres: string[];

  @IsString()
  @IsOptional()
  mainPainting?: string;
}
