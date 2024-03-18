// search.dto.ts
import { IsOptional, IsArray, IsString, ValidateNested, IsIn, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchDto {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SearchCondition)
  conditions?: SearchCondition[];
}

export class SearchCondition {
  @IsString()
  @ApiProperty()
  field: string;

  @IsString()
  @IsIn(['like', 'notLike', 'in', 'between', '=', '<', '>', '<=', '>=', '<>'])
  @ApiProperty({ enum: ['like', 'notLike', 'in', 'between', '=', '<', '>', '<=', '>=', '<>'] })
  operator: 'like' | 'notLike' | 'notNull' | 'in' | 'between' | '=' | '<' | '>' | '<=' | '>=' | '<>';

  @IsNotEmpty()
  @ApiProperty()
  value: any;
}
