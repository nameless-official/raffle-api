import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePrizeLevelDto {
  @IsString({ message: 'Property grouper must be a string value' })
  @MaxLength(100, { message: 'Property grouper must be smaller than 100 characters' })
  grouper: string;

  @IsString({ message: 'Property code must be a string value' })
  @MaxLength(50, { message: 'Property code must be smaller than 50 characters' })
  code: string;

  @IsString({ message: 'Property name must be a string value' })
  @MaxLength(255, { message: 'Property name must be smaller than 255 characters' })
  name: string;

  @IsInt({ message: 'Property sort must be an integer value' })
  @IsNotEmpty({ message: 'Property sort is required' })
  sort: number;
}
