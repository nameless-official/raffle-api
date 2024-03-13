import { PartialType } from '@nestjs/mapped-types';
import { CreateRaffleStatusDto } from './create-raffle_status.dto';
import { IsBoolean, IsString, IsInt, IsOptional, MaxLength } from 'class-validator';

export class UpdateRaffleStatusDto extends PartialType(CreateRaffleStatusDto) {
  @IsOptional()
  @IsString({ message: 'Property code must be a string value' })
  @MaxLength(50, { message: 'Property code must be a smaller than 50 characters ' })
  code?: string;

  @IsOptional()
  @IsString({ message: 'Property name must be a string value' })
  @MaxLength(50, { message: 'Property name must be a smaller than 50 characters' })
  name?: string;

  @IsInt({ message: 'Property sort must be a integer value' })
  sort?: number;

  @IsBoolean({ message: 'Property is_finished must be a boolean value' })
  is_finished?: boolean;
}
