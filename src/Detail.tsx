import { DetailMovie, loadDetails } from './omdbClient'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface DetailParams {
  id: string
}

export default function Detail (): React.ReactElement {
  const { id } = useParams<DetailParams>()
  const [isLoaded, setIsLoaded] = useState(false)
  const [movie, setMovie] = useState<DetailMovie | undefined>()

  useEffect(() => {
    setIsLoaded(false)

    loadDetails(id)
      .then((movie) => {
        setIsLoaded(true)
        setMovie(movie)
      })
      .catch((error) => { throw error })
  }, [id])

  return (
    <>
      {!isLoaded && (
        <div>Loading...</div>
      )}

      <div>
        <img
          alt={'Poster image for ' + (movie?.Title ?? '')}
          src={movie?.Poster ?? ''}
        />
      </div>
      <div>Title: {movie?.Title}</div>
      <div>Type: {movie?.Type}</div>
      <div>Year: {movie?.Year}</div>
      <div>Released: {movie?.Released}</div>
      <div>Genre: {movie?.Genre}</div>

      {movie?.Ratings?.map((rating) => (
        <div key={rating.Source}>
          {rating.Source}: {rating.Value}
        </div>
      ))}
    </>
  )
}
