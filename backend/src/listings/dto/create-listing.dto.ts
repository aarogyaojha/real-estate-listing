import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType } from '@prisma/client';

export class CreateListingDto {
  @ApiProperty({ example: 'Spacious house in Kathmandu' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A beautiful property with mountain views.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 15000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'Kathmandu' })
  @IsString()
  @IsNotEmpty()
  suburb: string;

  @ApiProperty({ example: 'Bagmati' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: '44600' })
  @IsString()
  @IsNotEmpty()
  postcode: string;

  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms: number;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  parkingSpaces?: number;

  @ApiPropertyOptional({ example: 250 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  landSizeSqm?: number;

  @ApiPropertyOptional({ example: 120 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  floorSizeSqm?: number;

  @ApiProperty({ example: 'agent-uuid-here' })
  @IsString()
  @IsNotEmpty()
  agentId: string;

  @ApiPropertyOptional({ example: 'Vendor wants quick settlement.' })
  @IsString()
  @IsOptional()
  internalNotes?: string;
}
