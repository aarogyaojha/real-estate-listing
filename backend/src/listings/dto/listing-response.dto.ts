import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType, ListingStatus } from '@prisma/client';

export class ListingResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  suburb: string;
  @ApiProperty({ enum: PropertyType })
  propertyType: PropertyType;
  @ApiProperty()
  bedrooms: number;
  @ApiProperty()
  bathrooms: number;
  @ApiPropertyOptional({ description: 'Admin only', enum: ListingStatus })
  status?: ListingStatus;
  @ApiPropertyOptional({ description: 'Admin only' })
  internalNotes?: string;
  @ApiProperty()
  isSaved: boolean;
}
