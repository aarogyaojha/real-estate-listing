import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  ForbiddenException,
  Delete,
  Patch,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiParam,
  ApiCookieAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import { SearchListingsDto } from './dto/search-listings.dto';
import { CreateListingDto } from './dto/create-listing.dto';
import { CreateSavedSearchDto } from './dto/create-saved-search.dto';
import { ListingResponseDto } from './dto/listing-response.dto';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PropertyType, UserRole } from '@prisma/client';

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new listing (admin or agent only)' })
  @ApiCookieAuth('access_token')
  @ApiBody({ type: CreateListingDto })
  @ApiResponse({ status: 201, description: 'Listing created' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async create(@Body() dto: CreateListingDto, @CurrentUser() user: any) {
    if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.AGENT) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return this.listingsService.create(dto);
  }

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
    return this.listingsService.findAll(
      dto,
      user?.role === UserRole.ADMIN,
      user?.userId,
    );
  }

  @Get('suburbs')
  @ApiOperation({ summary: 'Get distinct list of suburbs that have listings' })
  @ApiResponse({ status: 200 })
  async getSuburbs() {
    return this.listingsService.getSuburbs();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a listing (Admin only)' })
  @ApiResponse({ status: 200, description: 'Listing deleted' })
  async remove(@Param('id') id: string) {
    return this.listingsService.remove(id);
  }

  @Get(':id/similar')
  @ApiOperation({ summary: 'Get similar listings' })
  @ApiResponse({ status: 200, description: 'Similar listings array' })
  async getSimilar(@Param('id') id: string) {
    return this.listingsService.findSimilar(id);
  }

  @Get(':id/price-history')
  @ApiOperation({ summary: 'Get pricing history for a listing' })
  @ApiResponse({ status: 200, description: 'Price history array' })
  async getPriceHistory(@Param('id') id: string) {
    return this.listingsService.getPriceHistory(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update listing status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.listingsService.updateStatus(id, status);
  }

  @Get('saved')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all listings saved by the current user' })
  @ApiCookieAuth('access_token')
  @ApiResponse({ status: 200, description: 'List of saved listings' })
  async getSaved(@CurrentUser() user: any) {
    return this.listingsService.getSaved(user.userId);
  }

  @Post('save')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Toggle save listing for user' })
  async toggleSave(@Request() req, @Body('listingId') listingId: string) {
    return this.listingsService.toggleSave(req.user.id, listingId);
  }

  @Post('saved-searches')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Save a search' })
  async createSavedSearch(@Request() req, @Body() dto: CreateSavedSearchDto) {
    return this.listingsService.createSavedSearch(
      req.user.id,
      dto.name,
      dto.filtersJSON,
    );
  }

  @Get('saved-searches')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get saved searches' })
  async getSavedSearches(@Request() req) {
    return this.listingsService.getSavedSearches(req.user.id);
  }

  @Delete('saved-searches/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a saved search' })
  async deleteSavedSearch(@Request() req, @Param('id') id: string) {
    return this.listingsService.deleteSavedSearch(req.user.id, id);
  }

  @Get(':id')
  @UseGuards(OptionalJwtGuard)
  @ApiOperation({ summary: 'Get listing by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: ListingResponseDto })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiCookieAuth('access_token')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.listingsService.findOne(
      id,
      user?.role === UserRole.ADMIN,
      user?.userId,
    );
  }
}
