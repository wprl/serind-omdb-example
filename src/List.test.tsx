import React from 'react';
import { render, screen } from '@testing-library/react';
import List from './List';

test('renders', async () => {
  render(<List />)
  expect(await screen.findByLabelText('Title')).toBeInTheDocument()
});
