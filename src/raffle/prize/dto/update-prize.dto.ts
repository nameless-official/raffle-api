import { PartialType } from '@nestjs/mapped-types';
import { CreatePrizeDto } from './create-prize.dto';
import { IsNotEmpty, IsString, IsInt, IsOptional, MaxLength, IsISO8601, IsUrl, IsDecimal, Min } from 'class-validator';

export class UpdatePrizeDto extends PartialType(CreatePrizeDto) {
  @IsInt({ message: 'Property prize_level_id must be an integer value' })
  @IsNotEmpty({ message: 'Property prize_level_id is required' })
  prize_level_id?: number;

  @IsInt({ message: 'Property raffle_id must be an integer value' })
  @IsNotEmpty({ message: 'Property raffle_id is required' })
  raffle_id?: number;

  @IsString({ message: 'Property name must be a string value' })
  @MaxLength(255, { message: 'Property name must be smaller than 255 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Property name must be a string value' })
  description?: string;

  @IsOptional()
  value?: number;

  @IsOptional()
  @IsInt({ message: 'Property quantity must be an integer value' })
  @Min(1, { message: 'Property quantity must be greater than 0' })
  quantity?: number;

  @IsOptional()
  @IsUrl(
    {
      require_protocol: true,
      protocols: ['https'],
      require_valid_protocol: true,
    },
    { message: 'image_url debe dirigir a una imagen sobre https' },
  )
  image_url?: string;

  @IsOptional()
  @IsUrl(
    {
      require_protocol: true,
      protocols: ['https'],
      require_valid_protocol: true,
    },
    { message: 'image_thumbnail_url debe dirigir a una imagen sobre https' },
  )
  image_thumbnail_url?: string;
}
