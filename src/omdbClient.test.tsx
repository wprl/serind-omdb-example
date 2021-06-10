import { search, loadDetails } from './omdbClient'

test('searches', async () => {
  const results = await search({ title: 'Monkey', year: '', type: '' })
  expect(results.length).toBeGreaterThan(0)
})

test('searches', async () => {
  const movie = await loadDetails('tt0086148')
  expect(movie).not.toBeUndefined()
})
