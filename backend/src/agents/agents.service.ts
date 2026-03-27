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
    const agents = await this.prisma.agent.findMany();
    
    // Enrich with ratings
    return Promise.all(agents.map(async (agent) => {
      const stats = await this.prisma.agentReview.aggregate({
        where: { agentId: agent.id },
        _avg: { rating: true },
        _count: true,
      });

      const listingCount = await this.prisma.listing.count({
        where: { agentId: agent.id, status: 'ACTIVE' },
      });

      return {
        ...agent,
        avgRating: stats._avg.rating || 0,
        reviewCount: stats._count || 0,
        activeListingCount: listingCount,
      };
    }));
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

    const ratings = await this.prisma.agentReview.aggregate({
      where: { agentId: id },
      _avg: { rating: true },
      _count: true,
    });

    return {
      agent: {
        ...agent,
        avgRating: ratings._avg.rating || 0,
        reviewCount: ratings._count || 0,
      },
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

  async getAdminStats() {
    const agents = await this.prisma.agent.findMany();
    
    return Promise.all(agents.map(async (agent) => {
      const stats = await this.prisma.listing.groupBy({
        by: ['status'],
        where: { agentId: agent.id },
        _count: true,
        _avg: { price: true },
      });

      const totalListings = await this.prisma.listing.count({ where: { agentId: agent.id } });

      return {
        agentId: agent.id,
        agentName: agent.name,
        totalListings,
        stats: stats.map(s => ({
          status: s.status,
          count: s._count,
          avgPrice: s._avg.price || 0,
        })),
      };
    }));
  }

  async update(id: string, data: any) {
    return this.prisma.agent.update({
      where: { id },
      data,
    });
  }
}
