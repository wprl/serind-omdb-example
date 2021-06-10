import App from './App';
import { createMemoryHistory } from 'history'
import React from 'react';
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react';

test('renders', async () => {
  window.history.pushState({}, 'Test page', '/movies/tt1717715')

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )
  expect(await screen.findByText('The Monkey King Havoc in Heavens Palace')).toBeInTheDocument()
});
