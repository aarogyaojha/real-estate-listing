import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListingsService } from '../listings/listings.service';
import { SearchListingsDto } from '../listings/dto/search-listings.dto';

@Injectable()
export class AgentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly listingsService: ListingsService
  ) {}

  async findAll() {
    return this.prisma.agent.findMany();
  }

  async findOne(id: string, query: SearchListingsDto) {
    const agent = await this.prisma.agent.findUnique({
      where: { id },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const page = query.page || 1;
    const limit = query.limit || 12;

    const listingsWhere = {
      ...this.listingsService.buildWhereClause(query),
      agentId: id,
      status: 'ACTIVE' as const,
    };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.listing.findMany({
        where: listingsWhere,
        skip,
        take: limit,
        orderBy: { listedAt: 'desc' },
      }),
      this.prisma.listing.count({ where: listingsWhere }),
    ]);

    const sanitizedListings = items.map(l => this.listingsService.sanitize(l, false));

    return {
      agent,
      listings: {
        data: sanitizedListings,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        }
      }
    };
  }
}
