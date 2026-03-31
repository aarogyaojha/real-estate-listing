import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSavedSearchDto {
  @ApiProperty({ example: 'My Dream House Search' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '{"suburb": "Kathmandu", "price_max": 5000000}' })
  @IsString()
  @IsNotEmpty()
  filtersJSON: string;
}
