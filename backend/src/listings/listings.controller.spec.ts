import { NotFoundException } from '@nestjs/common';

const createMockListingsService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  sanitize: jest.fn((listing: any, isAdmin: boolean) => {
    if (isAdmin) return listing;
    const { status, internalNotes, ...publicFields } = listing;
    return publicFields;
  }),
  buildWhereClause: jest.fn(),
});

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
    internalNotes: 'Secret note',
  },
];

describe('ListingsController (inline)', () => {
  let mockSvc: ReturnType<typeof createMockListingsService>;

  beforeEach(() => {
    mockSvc = createMockListingsService();
  });

  it('findAll should return paginated data with data and meta', async () => {
    const mockResult = {
      data: mockListings,
      meta: { total: 1, page: 1, limit: 12, totalPages: 1 },
    };
    mockSvc.findAll.mockResolvedValue(mockResult);

    const result = await mockSvc.findAll({}, false);
    expect(result.data).toBeInstanceOf(Array);
    expect(result.meta).toHaveProperty('total');
    expect(result.meta).toHaveProperty('page');
  });

  it('findAll with suburb should call service with that suburb', async () => {
    mockSvc.findAll.mockResolvedValue({
      data: [],
      meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
    });
    await mockSvc.findAll({ suburb: 'Kathmandu' }, false);
    expect(mockSvc.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ suburb: 'Kathmandu' }),
      false,
    );
  });

  it('findAll with price range should pass price_min and price_max', async () => {
    mockSvc.findAll.mockResolvedValue({
      data: [],
      meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
    });
    await mockSvc.findAll({ price_min: 10000000, price_max: 30000000 }, false);
    expect(mockSvc.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ price_min: 10000000, price_max: 30000000 }),
      false,
    );
  });

  it('findOne should throw NotFoundException for unknown id', async () => {
    mockSvc.findOne.mockRejectedValue(
      new NotFoundException('Listing not found'),
    );
    await expect(mockSvc.findOne('unknown-uuid', false)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('sanitize with isAdmin=false should not include status or internalNotes', () => {
    const result = mockSvc.sanitize(mockListings[0], false);
    expect(result).not.toHaveProperty('status');
    expect(result).not.toHaveProperty('internalNotes');
  });

  it('sanitize with isAdmin=true should include status and internalNotes', () => {
    const result = mockSvc.sanitize(mockListings[0], true);
    expect(result).toHaveProperty('status', 'ACTIVE');
    expect(result).toHaveProperty('internalNotes', 'Secret note');
  });
});
