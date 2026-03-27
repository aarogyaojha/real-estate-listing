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
};

jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
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
