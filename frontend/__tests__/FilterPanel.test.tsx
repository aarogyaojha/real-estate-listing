import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from '../components/FilterPanel';

const mockOnFilterChange = jest.fn();

const defaultFilters = {};

describe('FilterPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('typing in suburb input calls onFilterChange with { suburb }', () => {
    render(<FilterPanel filters={defaultFilters} onFilterChange={mockOnFilterChange} />);
    const input = screen.getByPlaceholderText('e.g. Kathmandu');
    fireEvent.change(input, { target: { value: 'Kathmandu' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ suburb: 'Kathmandu' });
  });

  it('renders price range inputs', () => {
    render(<FilterPanel filters={defaultFilters} onFilterChange={mockOnFilterChange} />);
    expect(screen.getByLabelText('Min Price (NPR)')).toBeInTheDocument();
    expect(screen.getByLabelText('Max Price (NPR)')).toBeInTheDocument();
  });
});
