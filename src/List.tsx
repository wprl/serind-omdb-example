import React, { useEffect, useState } from 'react';

const noPosterImageUrl = ''
const omdbApiKey = 'c4de1ece'
const omdbSearchUrl = `http://www.omdbapi.com/`

interface ImdbData {
  imdbID: string,
  Poster: string,
  Title: string,
  Type: string,
  Year: number
}

interface ImdbResponse {
  Error?: string,
  Response: string,
  Search: Array<ImdbData>
}

interface SearchParameters {
  title: string,
  type: string,
  year: string
}


const search = async (parameters: SearchParameters) => {
  const {title, year, type} = parameters
  const trimmedTitle = title.trim()

  if (!trimmedTitle) {
    return []
  }

  const url = new URL(omdbSearchUrl)
  url.searchParams.append('apikey', omdbApiKey)
  url.searchParams.append('s', trimmedTitle)

  if (year) url.searchParams.append('y', year)
  if (type) url.searchParams.append('type', type)

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const result = await (response.json() as Promise<ImdbResponse>)

  if (result.Response === 'True') {
    return result.Search
  }

  const errorMessage = result.Error || 'No error text received from server'
  if (errorMessage === 'Movie not found!') {
    return []
  }

  throw new Error(`Error from OMDB API: ${errorMessage}`)
}

export default function List() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [year, setYear] = useState('');
  const [searchParams, setSearchParams] = useState({ title, type, year });
  const [searchResults, setSearchResults] = useState<Array<ImdbData>>([]);

  useEffect(() => {
    setIsLoaded(false);

    (async () => {
      const results = await search(searchParams)
      setIsLoaded(true)
      setSearchResults(results)
    })()
  }, [searchParams])

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setSearchParams({ title, year, type })
        }}>

        <label>
          Title
          <input
            type="text"
            minLength={3}
            onChange={(e) => setTitle(e.target.value)}
            required={true}
            value={title}
          />
        </label>

        <label>
          Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Any</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="episode">Episode</option>
          </select>
        </label>

        <label>
          Year
          <input
            type="number"
            max={(new Date()).getFullYear()}
            min={1888}
            onChange={(e) => setYear(e.target.value)}
            value={year}
          />
        </label>

        <input type="submit" value="Search" />
      </form>

      {!isLoaded && (
        <div>Loading...</div>
      )}

      <table>
        <tbody>
          {searchResults.map(movie => (
            <tr>
              <td>
                <a href={'/movies/' + movie.imdbID}>Details</a>
              </td>
              <td>
                <img
                  alt={'Poster image for ' + movie.Title}
                  width="100px"
                  src={movie.Poster || noPosterImageUrl} />
              </td>
              <td>{movie.Title}</td>
              <td>{movie.Type}</td>
              <td>{movie.Year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
