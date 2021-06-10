import List from './List'
import React from 'react'
import { render, screen } from '@testing-library/react'

test('renders', async () => {
  render(<List />)
  expect(await screen.findByLabelText('Title')).toBeInTheDocument()
})
