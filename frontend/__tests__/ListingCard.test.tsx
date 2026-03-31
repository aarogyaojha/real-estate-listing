import React from 'react';
import { render, screen } from '@testing-library/react';
import { ListingCard } from '../src/components/ListingCard';

const mockListing = {
  id: 'test-uuid',
  title: 'Beautiful Suburban Home',
  price: 15000000,
  suburb: 'Kathmandu',
  state: 'Bagmati',
  propertyType: 'HOUSE',
  bedrooms: 3,
  bathrooms: 2,
  parkingSpaces: 1,
  description: 'A nice home in suburbs',
  postcode: '44600',
  status: 'ACTIVE',
  listedAt: '2026-01-01T00:00:00Z'
};

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('ListingCard', () => {
  it('renders title', () => {
    render(<ListingCard listing={mockListing} />);
    expect(screen.getByText('Beautiful Suburban Home')).toBeInTheDocument();
  });

  it('renders price formatted as NPR X,XX,XXX', () => {
    render(<ListingCard listing={mockListing} />);
    expect(screen.getByText('NPR 1,50,00,000')).toBeInTheDocument();
  });

  it('renders suburb', () => {
    render(<ListingCard listing={mockListing} />);
    expect(screen.getByText(/Kathmandu.*Bagmati/)).toBeInTheDocument();
  });

  it('renders correct bed count', () => {
    render(<ListingCard listing={mockListing} />);
    expect(screen.getByText(/3 bed/)).toBeInTheDocument();
  });
});
