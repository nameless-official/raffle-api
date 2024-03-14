import { IsDecimal, IsInt, IsNotEmpty, IsString, MaxLength, Min, IsOptional, IsUrl, IsEmail } from 'class-validator';
export class CreateParticipantDto {
  @IsInt({ message: 'Property raffle_id must be an integer value' })
  @IsNotEmpty({ message: 'Property raffle_id is required' })
  raffle_id: number;

  @IsInt({ message: 'Property discord_user_id must be an integer value' })
  @IsNotEmpty({ message: 'Property discord_user_id is required' })
  discord_user_id: number;

  @IsString({ message: 'Property name must be a string value' })
  @MaxLength(255, { message: 'Property name must be smaller than 255 characters' })
  name: string;

  @IsEmail({}, { message: 'Property email must be a valid email address' })
  email: string;

  @IsOptional()
  prize_id?: number;
}
