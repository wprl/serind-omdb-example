import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders', async () => {
  render(<App />)
  expect(await screen.findByLabelText('Title')).toBeInTheDocument()
});
