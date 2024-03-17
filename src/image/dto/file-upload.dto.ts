import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @IsString({ message: 'Property container must be a string value' })
  @MaxLength(255, { message: 'Property container must be smaller than 255 characters' })
  container: string;
}
