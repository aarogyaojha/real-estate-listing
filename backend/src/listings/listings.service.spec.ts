import { Test, TestingModule } from '@nestjs/testing';
import { ListingsService } from './listings.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  listing: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
  },
};

describe('ListingsService', () => {
  let service: ListingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ListingsService>(ListingsService);
  });

  describe('sanitize()', () => {
    const mockListing: any = {
      id: 'uuid',
      title: 'Test',
      price: 10000000,
      status: 'ACTIVE',
      internalNotes: 'Secret note',
    };

    it('should omit status and internalNotes when isAdmin is false', () => {
      const result = service.sanitize(mockListing, false);
      expect(result).not.toHaveProperty('status');
      expect(result).not.toHaveProperty('internalNotes');
    });

    it('should keep all fields when isAdmin is true', () => {
      const result = service.sanitize(mockListing, true);
      expect(result).toHaveProperty('status', 'ACTIVE');
      expect(result).toHaveProperty('internalNotes', 'Secret note');
    });
  });

  describe('buildWhereClause()', () => {
    it('should produce correct Prisma where object for suburb + price range', () => {
      const where = service.buildWhereClause({ suburb: 'Kathmandu', price_min: 5000000, price_max: 20000000 } as any);
      expect(where.suburb).toEqual({ equals: 'Kathmandu', mode: 'insensitive' });
      expect((where.price as any)?.gte).toBe(5000000);
      expect((where.price as any)?.lte).toBe(20000000);
    });

    it('should include bedrooms and bathrooms filters', () => {
      const where = service.buildWhereClause({ bedrooms: 3, bathrooms: 2 } as any);
      expect(where.bedrooms).toBe(3);
      expect(where.bathrooms).toBe(2);
    });
  });
});
