import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

const noPosterImageUrl = ''
const omdbApiKey = 'c4de1ece'
const omdbSearchUrl = `http://www.omdbapi.com/`

interface DetailParams {
  id: string
}

interface ImdbData {
  imdbID?: string,
  Poster?: string,
  Title?: string,
  Type?: string,
  Year?: number,
  Released?: number,
  Genre?: string,
  Ratings?: [ { Source: string, Value: string } ],
  Error?: string,
  Response: string,
}

const loadDetails = async (id: string) => {
  const url = new URL(omdbSearchUrl)
  url.searchParams.append('apikey', omdbApiKey)
  url.searchParams.append('i', id)

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const movie = await (response.json() as Promise<ImdbData>)

  if (movie.Response === 'True') {
    return movie
  }

  const errorMessage = movie.Error || 'No error text received from server'
  throw new Error(`Error from OMDB API: ${errorMessage}`)
}

export default function Detail() {
  const { id } = useParams() as DetailParams
  const [isLoaded, setIsLoaded] = useState(false);
  const [movie, setMovie] = useState<ImdbData | undefined>();

  useEffect(() => {
    setIsLoaded(false);

    (async () => {
      const movie = await loadDetails(id)
      setIsLoaded(true)
      setMovie(movie)
    })()
  }, [id])

  return (
    <>
      {!isLoaded && (
        <div>Loading...</div>
      )}

      {movie && (
        <>
          <div><img
            alt={'Poster image for ' + movie.Title}
            src={movie.Poster || noPosterImageUrl} /></div>
          <div>{movie.Title}</div>
          <div>{movie.Type}</div>
          <div>{movie.Year}</div>
          <div>{movie.Released}</div>
          <div>{movie.Genre}</div>
        </>
      )}

      {movie && movie.Ratings && (
        <ul>
          {movie.Ratings.map((rating) => (
            <li key={rating.Source}>
              {rating.Source}: {rating.Value}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
