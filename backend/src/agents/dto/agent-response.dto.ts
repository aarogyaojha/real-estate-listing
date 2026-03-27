import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ListingResponseDto } from '../../listings/dto/listing-response.dto';

export class AgentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiProperty()
  agencyName: string;

  @ApiPropertyOptional({ type: () => [ListingResponseDto] })
  listings?: ListingResponseDto[];
}
