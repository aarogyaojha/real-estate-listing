import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchListingsDto } from './dto/search-listings.dto';
import { CreateListingDto } from './dto/create-listing.dto';
import { Listing, Prisma, ListingStatus } from '@prisma/client';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateListingDto) {
    return this.prisma.listing.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        suburb: dto.suburb,
        state: dto.state,
        postcode: dto.postcode,
        propertyType: dto.propertyType,
        bedrooms: dto.bedrooms,
        bathrooms: dto.bathrooms,
        parkingSpaces: dto.parkingSpaces ?? 0,
        landSizeSqm: dto.landSizeSqm,
        floorSizeSqm: dto.floorSizeSqm,
        internalNotes: dto.internalNotes,
        agentId: dto.agentId,
      },
      include: { agent: true },
    });
  }

  async getSuburbs(): Promise<string[]> {
    const results = await this.prisma.listing.findMany({
      select: { suburb: true },
      distinct: ['suburb'],
      orderBy: { suburb: 'asc' },
    });
    return results.map((r) => r.suburb);
  }

  async findAll(dto: SearchListingsDto, isAdmin: boolean, userId?: string) {
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

    let savedIds = new Set<string>();
    if (userId) {
      const saved = await this.prisma.savedListing.findMany({
        where: { userId },
        select: { listingId: true },
      });
      savedIds = new Set(saved.map((s) => s.listingId));
    }

    return {
      data: items.map((item) => ({
        ...this.sanitize(item, isAdmin),
        isSaved: savedIds.has(item.id),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, isAdmin: boolean, userId?: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { agent: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    let isSaved = false;
    if (userId) {
      const saved = await this.prisma.savedListing.findUnique({
        where: { userId_listingId: { userId, listingId: id } },
      });
      isSaved = !!saved;
    }

    return { ...this.sanitize(listing, isAdmin), isSaved };
  }

  async toggleSave(userId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });
    if (!listing) throw new NotFoundException('Listing not found');

    const existing = await this.prisma.savedListing.findUnique({
      where: { userId_listingId: { userId, listingId } },
    });

    if (existing) {
      await this.prisma.savedListing.delete({
        where: { userId_listingId: { userId, listingId } },
      });
      return { isSaved: false };
    } else {
      await this.prisma.savedListing.create({ data: { userId, listingId } });
      return { isSaved: true };
    }
  }

  async getSaved(userId: string) {
    const saved = await this.prisma.savedListing.findMany({
      where: { userId },
      include: { listing: { include: { agent: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return saved.map((s) => ({ ...s.listing, isSaved: true }));
  }

  buildWhereClause(dto: SearchListingsDto): Prisma.ListingWhereInput {
    const where: Prisma.ListingWhereInput = {};

    if (dto.suburbs) {
      const suburbList = dto.suburbs.split(',').filter(Boolean);
      if (suburbList.length > 0) {
        where.suburb = { in: suburbList, mode: 'insensitive' };
      }
    } else if (dto.suburb) {
      where.suburb = { equals: dto.suburb, mode: 'insensitive' };
    }

    if (dto.price_min !== undefined || dto.price_max !== undefined) {
      where.price = {};
      if (dto.price_min !== undefined) where.price.gte = dto.price_min;
      if (dto.price_max !== undefined) where.price.lte = dto.price_max;
    }

    if (dto.bedrooms !== undefined) {
      if (dto.bedrooms >= 4) {
        where.bedrooms = { gte: 4 };
      } else {
        where.bedrooms = dto.bedrooms;
      }
    }

    if (dto.bathrooms !== undefined) {
      if (dto.bathrooms >= 4) {
        where.bathrooms = { gte: 4 };
      } else {
        where.bathrooms = dto.bathrooms;
      }
    }

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
    if (isAdmin) {
      return listing as unknown as Partial<T>;
    }
    const publicFields = { ...listing };
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (publicFields as any).internalNotes;
    return publicFields as unknown as Partial<T>;
  }

  async updateStatus(id: string, status: ListingStatus) {
    return this.prisma.listing.update({
      where: { id },
      data: { status },
    });
  }

  async update(id: string, dto: Partial<CreateListingDto>) {
    const current = await this.prisma.listing.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Listing not found');

    // Snapshot price if changed
    const oldPrice = Number(current.price).toFixed(2);
    const newPrice = Number(dto.price).toFixed(2);

    if (dto.price !== undefined && oldPrice !== newPrice) {
      await this.prisma.listingPriceHistory.create({
        data: {
          listingId: id,
          price: current.price,
        },
      });
    }

    return this.prisma.listing.update({
      where: { id },
      data: dto as Prisma.ListingUpdateInput,
    });
  }

  async getPriceHistory(id: string) {
    return this.prisma.listingPriceHistory.findMany({
      where: { listingId: id },
      orderBy: { changedAt: 'desc' },
    });
  }

  async createSavedSearch(userId: string, name: string, filtersJSON: string) {
    return this.prisma.savedSearch.create({
      data: { userId, name, filtersJSON },
    });
  }

  async getSavedSearches(userId: string) {
    return this.prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteSavedSearch(userId: string, id: string) {
    return this.prisma.savedSearch.delete({
      where: { id, userId },
    });
  }

  async remove(id: string) {
    return this.prisma.listing.delete({ where: { id } });
  }

  async findSimilar(id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found');

    // Search by property type and suburb
    let similar = await this.prisma.listing.findMany({
      where: {
        id: { not: id },
        propertyType: listing.propertyType,
        suburb: listing.suburb,
        status: 'ACTIVE',
      },
      take: 3,
      orderBy: { listedAt: 'desc' },
    });

    // Fallback to same type + within price range
    if (similar.length < 3) {
      const priceMin = Number(listing.price) * 0.8;
      const priceMax = Number(listing.price) * 1.2;

      const additional = await this.prisma.listing.findMany({
        where: {
          id: { notIn: [id, ...similar.map((l) => l.id)] },
          propertyType: listing.propertyType,
          price: { gte: priceMin, lte: priceMax },
          status: 'ACTIVE',
        },
        take: 3 - similar.length,
        orderBy: { listedAt: 'desc' },
      });
      similar = [...similar, ...additional];
    }

    return similar.map((l) => this.sanitize(l, false));
  }
}
