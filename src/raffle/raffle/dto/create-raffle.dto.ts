import { IsISO8601, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateRaffleDto {
  @IsInt({ message: 'Property raffle_status_id must be an integer value' })
  @IsNotEmpty({ message: 'Property raffle_status_id is required' })
  raffle_status_id: number;

  @IsString({ message: 'Property name must be a string value' })
  @MaxLength(255, { message: 'Property name must be smaller than 255 characters' })
  name: string;

  @IsNotEmpty({ message: 'Property start_date is required' })
  @IsISO8601(
    { strict: false },
    { message: 'date debe ser una fecha válida en formato ISO 8601 - YYYY-MM-DD o YYYY-MM-DDTHH:MM:SS' },
  )
  start_date: Date;

  @IsNotEmpty({ message: 'Property end_date is required' })
  @IsISO8601(
    { strict: false },
    { message: 'date debe ser una fecha válida en formato ISO 8601 - YYYY-MM-DD o YYYY-MM-DDTHH:MM:SS' },
  )
  end_date: Date;

  @IsOptional()
  @IsString({ message: 'Property name must be a string value' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Property name must be a string value' })
  slug?: string;

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
