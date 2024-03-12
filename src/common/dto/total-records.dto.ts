import { ApiProperty } from '@nestjs/swagger';

export class TotalRecords {
  @ApiProperty()
  totalRecords: number;
}
