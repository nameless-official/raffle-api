import { PartialType } from '@nestjs/mapped-types';
import { CreateRaffleStatusDto } from './create-raffle_status.dto';
import { IsBoolean, IsString, IsInt } from 'class-validator';

export class UpdateRaffleStatusDto extends PartialType(CreateRaffleStatusDto) {
  @IsString()
  code?: string;

  @IsString()
  name?: string;

  @IsInt()
  sort?: number;

  @IsBoolean()
  is_finished?: boolean;
}
