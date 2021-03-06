import { search, SearchMovie } from './omdbClient'
import React, { useEffect, useState } from 'react'

export default function List (): React.ReactElement {
  const [isLoaded, setIsLoaded] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [year, setYear] = useState('')
  const [searchParams, setSearchParams] = useState({ title, type, year })
  const [searchResults, setSearchResults] = useState<SearchMovie[]>([])

  useEffect(() => {
    setIsLoaded(false)

    search(searchParams)
      .then((results) => {
        setIsLoaded(true)
        setSearchResults(results)
      })
      .catch((error) => { throw error })
  }, [searchParams])

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setSearchParams({ title, year, type })
        }}
      >

        <label>
          Title
          <input
            type='text'
            minLength={3}
            onChange={(e) => setTitle(e.target.value)}
            required
            value={title}
          />
        </label>

        <label>
          Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value=''>Any</option>
            <option value='movie'>Movie</option>
            <option value='series'>Series</option>
            <option value='episode'>Episode</option>
          </select>
        </label>

        <label>
          Year
          <input
            type='number'
            max={(new Date()).getFullYear()}
            min={1888}
            onChange={(e) => setYear(e.target.value)}
            value={year}
          />
        </label>

        <input type='submit' value='Search' />
      </form>

      {!isLoaded && (
        <div>Loading...</div>
      )}

      <table>
        <tbody>
          {searchResults.map(movie => (
            <tr key={movie.imdbID}>
              <td>
                <a href={'/movies/' + movie.imdbID}>Details</a>
              </td>
              <td>
                <img
                  alt={'Poster image for ' + movie.Title}
                  width='100px'
                  src={movie.Poster ?? ''}
                />
              </td>
              <td>{movie.Title}</td>
              <td>{movie.Type}</td>
              <td>{movie.Year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
