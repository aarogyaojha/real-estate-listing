import { Test, TestingModule } from '@nestjs/testing';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { NotFoundException } from '@nestjs/common';

const mockListings = [
  {
    id: 'test-uuid-1',
    title: 'Beautiful House in Kathmandu',
    price: 15000000,
    suburb: 'Kathmandu',
    state: 'Bagmati',
    postcode: '44600',
    propertyType: 'HOUSE',
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 1,
    status: 'ACTIVE',
    internalNotes: null,
    agentId: 'agent-uuid-1',
    listedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const mockListingsService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  sanitize: jest.fn((listing: any, isAdmin: boolean) => {
    if (isAdmin) return listing;
    const { status, internalNotes, ...publicFields } = listing;
    return publicFields;
  }),
  buildWhereClause: jest.fn(),
};

describe('ListingsController', () => {
  let controller: ListingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListingsController],
      providers: [
        { provide: ListingsService, useValue: mockListingsService },
      ],
    }).compile();

    controller = module.get<ListingsController>(ListingsController);
    jest.clearAllMocks();
  });

  it('findAll should return paginated data', async () => {
    const mockResult = {
      data: mockListings,
      meta: { total: 1, page: 1, limit: 12, totalPages: 1 },
    };
    mockListingsService.findAll.mockResolvedValue(mockResult);

    const result = await controller.findAll({} as any, null);
    expect(result).toEqual(mockResult);
    expect(result.data).toBeInstanceOf(Array);
    expect(result.meta).toHaveProperty('total');
  });

  it('findAll with suburb filter should call service with correct args', async () => {
    mockListingsService.findAll.mockResolvedValue({ data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0 } });
    await controller.findAll({ suburb: 'Kathmandu' } as any, null);
    expect(mockListingsService.findAll).toHaveBeenCalledWith(expect.objectContaining({ suburb: 'Kathmandu' }), false);
  });

  it('findAll with price range should pass correctly to service', async () => {
    mockListingsService.findAll.mockResolvedValue({ data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0 } });
    await controller.findAll({ price_min: 10000000, price_max: 30000000 } as any, null);
    expect(mockListingsService.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ price_min: 10000000, price_max: 30000000 }),
      false
    );
  });

  it('findOne should throw NotFoundException for unknown UUID', async () => {
    mockListingsService.findOne.mockRejectedValue(new NotFoundException('Listing not found'));
    await expect(controller.findOne('unknown-uuid', null)).rejects.toThrow(NotFoundException);
  });

  it('findOne without auth should not include status or internalNotes', async () => {
    const sanitized = mockListingsService.sanitize(mockListings[0], false);
    mockListingsService.findOne.mockResolvedValue(sanitized);
    const result = await controller.findOne('test-uuid-1', null);
    expect(result).not.toHaveProperty('status');
    expect(result).not.toHaveProperty('internalNotes');
  });

  it('findOne with admin user should include status and internalNotes', async () => {
    const adminUser = { userId: 'admin-id', username: 'aarogyaojha', isAdmin: true };
    mockListingsService.findOne.mockResolvedValue(mockListings[0]);
    const result = await controller.findOne('test-uuid-1', adminUser as any);
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('internalNotes');
  });
});
