import { IsBoolean, IsInt, IsString, MaxLength } from 'class-validator';

export class CreateRaffleStatusDto {
  @IsString({ message: 'Property code must be a string value' })
  @MaxLength(50, { message: 'Property code must be a smaller than 50 characters ' })
  code: string;

  @IsString({ message: 'Property name must be a string value' })
  @MaxLength(50, { message: 'Property name must be a smaller than 50 characters' })
  name: string;

  @IsInt({ message: 'Property sort must be a integer value' })
  sort: number;

  @IsBoolean({ message: 'Property is_finished must be a boolean value' })
  is_finished: boolean;
}
