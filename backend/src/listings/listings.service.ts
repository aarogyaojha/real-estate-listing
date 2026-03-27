import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchListingsDto } from './dto/search-listings.dto';
import { Listing, Prisma } from '@prisma/client';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(dto: SearchListingsDto, isAdmin: boolean) {
    const { page = 1, limit = 12 } = dto;
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(dto);

    const [items, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { listedAt: 'desc' },
        include: { agent: true },
      }),
      this.prisma.listing.count({ where }),
    ]);

    return {
      data: items.map(item => this.sanitize(item, isAdmin)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, isAdmin: boolean) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { agent: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return this.sanitize(listing, isAdmin);
  }

  buildWhereClause(dto: SearchListingsDto): Prisma.ListingWhereInput {
    const where: Prisma.ListingWhereInput = {};
    if (dto.suburb) where.suburb = { equals: dto.suburb, mode: 'insensitive' };
    
    if (dto.price_min !== undefined || dto.price_max !== undefined) {
      where.price = {};
      if (dto.price_min !== undefined) where.price.gte = dto.price_min;
      if (dto.price_max !== undefined) where.price.lte = dto.price_max;
    }

    if (dto.bedrooms !== undefined) where.bedrooms = dto.bedrooms;
    if (dto.bathrooms !== undefined) where.bathrooms = dto.bathrooms;
    if (dto.property_type) where.propertyType = dto.property_type;
    
    if (dto.keyword) {
      where.OR = [
        { title: { contains: dto.keyword, mode: 'insensitive' } },
        { description: { contains: dto.keyword, mode: 'insensitive' } },
      ];
    }
    
    return where;
  }

  sanitize<T extends Listing>(listing: T, isAdmin: boolean): Partial<T> {
    const { status, internalNotes, ...publicFields } = listing;
    if (isAdmin) {
      return listing;
    }
    return publicFields as any;
  }
}
