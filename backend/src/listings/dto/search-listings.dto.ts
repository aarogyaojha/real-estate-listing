import { IsOptional, IsEnum, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyType } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchListingsDto {
  @ApiPropertyOptional({ example: 'Kathmandu' })
  @IsString()
  @IsOptional()
  suburb?: string;

  @ApiPropertyOptional({ example: 'Kathmandu,Lalitpur' })
  @IsString()
  @IsOptional()
  suburbs?: string;

  @ApiPropertyOptional({ example: 10000000 })
  @Type(() => Number)
  @IsOptional()
  price_min?: number;

  @ApiPropertyOptional({ example: 30000000 })
  @Type(() => Number)
  @IsOptional()
  price_max?: number;

  @ApiPropertyOptional({ example: 3 })
  @Type(() => Number)
  @IsOptional()
  bedrooms?: number;

  @ApiPropertyOptional({ example: 2 })
  @Type(() => Number)
  @IsOptional()
  bathrooms?: number;

  @ApiPropertyOptional({ enum: PropertyType })
  @IsEnum(PropertyType)
  @IsOptional()
  property_type?: PropertyType;

  @ApiPropertyOptional({ example: 'Beautiful' })
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 12, default: 12, minimum: 1, maximum: 50 })
  @Type(() => Number)
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 12;
}
