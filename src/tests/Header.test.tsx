import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Header from '@/components/Header';

describe('Header Component', () => {
  test('renders logo and navigation', () => {
    render(<Header />);

    expect(screen.getByText('Invoicipedia')).toBeInTheDocument();
  });
});
