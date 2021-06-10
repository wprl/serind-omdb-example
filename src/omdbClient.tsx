const omdbApiKey = 'c4de1ece'
const omdbSearchUrl = 'http://www.omdbapi.com/'

export interface SearchMovie {
  imdbID: string
  Poster: string
  Title: string
  Type: string
  Year: number
}

interface SearchResponse {
  Error?: string
  Response: string
  Search: SearchMovie[]
}

interface SearchParameters {
  title: string
  type: string
  year: string
}

export interface DetailMovie {
  imdbID: string
  Poster: string
  Title: string
  Type: string
  Year: number
  Released: number
  Genre: string
  Ratings: [ { Source: string, Value: string } ]
  Error?: string
  Response: string
}

export const search = async (parameters: SearchParameters): Promise<SearchMovie[]> => {
  const { title, year, type } = parameters
  const trimmedTitle = title.trim()

  if (trimmedTitle === '') {
    return []
  }

  const url = new URL(omdbSearchUrl)
  url.searchParams.append('apikey', omdbApiKey)
  url.searchParams.append('s', trimmedTitle)

  if (year !== '') url.searchParams.append('y', year)
  if (type !== '') url.searchParams.append('type', type)

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const result = await (response.json() as Promise<SearchResponse>)

  if (result.Response === 'True') {
    return result.Search
  }

  const errorMessage = result.Error ?? 'No error text received from server'

  if (errorMessage === 'Movie not found!') {
    return []
  }

  throw new Error(`Error from OMDB API: ${errorMessage}`)
}

export const loadDetails = async (id: string): Promise<DetailMovie> => {
  const url = new URL(omdbSearchUrl)
  url.searchParams.append('apikey', omdbApiKey)
  url.searchParams.append('i', id)

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const movie = await (response.json() as Promise<DetailMovie>)

  if (movie.Response === 'True') {
    return movie
  }

  const errorMessage = movie.Error ?? 'No error text received from server'
  throw new Error(`Error from OMDB API: ${errorMessage}`)
}
