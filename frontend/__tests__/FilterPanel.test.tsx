import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from '../src/components/FilterPanel';

const mockOnFilterChange = jest.fn();

const defaultFilters = {};

describe('FilterPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders suburb buttons and keyword input', () => {
    render(<FilterPanel filters={defaultFilters} onFilterChange={mockOnFilterChange} />);
    
    // Check for some default suburbs
    expect(screen.getByText('Kathmandu')).toBeInTheDocument();
    expect(screen.getByText('Patan')).toBeInTheDocument();

    // Check for keyword input
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('clicking a suburb button calls onFilterChange with the updated suburbs list', () => {
    render(<FilterPanel filters={defaultFilters} onFilterChange={mockOnFilterChange} />);
    
    const kathmanduButton = screen.getByText('Kathmandu');
    fireEvent.click(kathmanduButton);
    
    // It should call with { suburbs: 'Kathmandu', suburb: undefined }
    expect(mockOnFilterChange).toHaveBeenCalledWith({ suburbs: 'Kathmandu', suburb: undefined });
  });

  it('renders clear all button', () => {
    render(<FilterPanel filters={defaultFilters} onFilterChange={mockOnFilterChange} />);
    expect(screen.getByText('Clear all')).toBeInTheDocument();
  });
});
