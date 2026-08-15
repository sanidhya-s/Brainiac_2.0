import React from 'react';
import { render, screen } from '@testing-library/react';
import GenerativeUI from '../src/components/GenerativeUI';

describe('GenerativeUI Component', () => {
  it('renders Text component correctly', () => {
    const schema = {
      type: 'Text',
      props: { content: 'Hello World', variant: 'h1' }
    };
    
    render(<GenerativeUI schema={schema} />);
    const heading = screen.getByText('Hello World');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('renders MetricCard component correctly', () => {
    const schema = {
      type: 'MetricCard',
      props: { title: 'Total Sales', value: '$10,000' }
    };
    
    render(<GenerativeUI schema={schema} />);
    expect(screen.getByText('Total Sales')).toBeInTheDocument();
    expect(screen.getByText('$10,000')).toBeInTheDocument();
  });

  it('renders Badge component correctly', () => {
    const schema = {
      type: 'Badge',
      props: { text: 'Active', variant: 'primary' }
    };
    
    render(<GenerativeUI schema={schema} />);
    const badge = screen.getByText('Active');
    expect(badge).toBeInTheDocument();
  });
});
