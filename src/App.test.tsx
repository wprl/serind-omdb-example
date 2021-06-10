import App from './App';
import React from 'react';
import { render, screen } from '@testing-library/react';

test('renders', async () => {
  render(<App />)
  expect(await screen.findByLabelText('Title')).toBeInTheDocument()
});
