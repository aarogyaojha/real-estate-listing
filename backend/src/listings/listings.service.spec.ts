function sanitize(listing: any, isAdmin: boolean) {
  const { status, internalNotes, ...publicFields } = listing;
  if (isAdmin) return listing;
  return publicFields;
}

function buildWhereClause(dto: any) {
  const where: any = {};
  if (dto.suburb) where.suburb = { equals: dto.suburb, mode: 'insensitive' };
  if (dto.price_min !== undefined || dto.price_max !== undefined) {
    where.price = {};
    if (dto.price_min !== undefined) where.price.gte = dto.price_min;
    if (dto.price_max !== undefined) where.price.lte = dto.price_max;
  }
  if (dto.bedrooms !== undefined) where.bedrooms = dto.bedrooms;
  if (dto.bathrooms !== undefined) where.bathrooms = dto.bathrooms;
  if (dto.property_type) where.propertyType = dto.property_type;
  return where;
}

describe('ListingsService logic', () => {
  const mockListing = {
    id: 'uuid',
    title: 'Test Listing',
    price: 10000000,
    status: 'ACTIVE',
    internalNotes: 'Secret note',
  };

  describe('sanitize()', () => {
    it('should omit status and internalNotes when isAdmin is false', () => {
      const result = sanitize(mockListing, false);
      expect(result).not.toHaveProperty('status');
      expect(result).not.toHaveProperty('internalNotes');
      expect(result).toHaveProperty('title');
    });

    it('should keep all fields when isAdmin is true', () => {
      const result = sanitize(mockListing, true);
      expect(result).toHaveProperty('status', 'ACTIVE');
      expect(result).toHaveProperty('internalNotes', 'Secret note');
    });
  });

  describe('buildWhereClause()', () => {
    it('should produce correct where for suburb + price range', () => {
      const where = buildWhereClause({
        suburb: 'Kathmandu',
        price_min: 5000000,
        price_max: 20000000,
      });
      expect(where.suburb).toEqual({
        equals: 'Kathmandu',
        mode: 'insensitive',
      });
      expect(where.price?.gte).toBe(5000000);
      expect(where.price?.lte).toBe(20000000);
    });

    it('should include bedrooms and bathrooms filters', () => {
      const where = buildWhereClause({ bedrooms: 3, bathrooms: 2 });
      expect(where.bedrooms).toBe(3);
      expect(where.bathrooms).toBe(2);
    });
  });
});
