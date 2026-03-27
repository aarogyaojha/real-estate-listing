import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiParam, ApiCookieAuth } from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import { SearchListingsDto } from './dto/search-listings.dto';
import { ListingResponseDto } from './dto/listing-response.dto';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PropertyType } from '@prisma/client';

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  @ApiOperation({ summary: 'Search listings with filters and pagination' })
  @ApiQuery({ name: 'suburb', required: false })
  @ApiQuery({ name: 'price_min', required: false, type: Number })
  @ApiQuery({ name: 'price_max', required: false, type: Number })
  @ApiQuery({ name: 'bedrooms', required: false, type: Number })
  @ApiQuery({ name: 'bathrooms', required: false, type: Number })
  @ApiQuery({ name: 'property_type', required: false, enum: PropertyType })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated listing results' })
  @ApiCookieAuth('access_token')
  async findAll(@Query() dto: SearchListingsDto, @CurrentUser() user: any) {
    const isAdmin = user?.isAdmin ?? false;
    return this.listingsService.findAll(dto, isAdmin);
  }

  @Get(':id')
  @UseGuards(OptionalJwtGuard)
  @ApiOperation({ summary: 'Get listing by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: ListingResponseDto })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiCookieAuth('access_token')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    const isAdmin = user?.isAdmin ?? false;
    return this.listingsService.findOne(id, isAdmin);
  }
}
