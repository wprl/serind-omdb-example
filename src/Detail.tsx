import { DetailMovie, loadDetails } from './omdbClient'
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Detail() {
  const { id } = useParams() as { id: string }
  const [isLoaded, setIsLoaded] = useState(false);
  const [movie, setMovie] = useState<DetailMovie | undefined>();

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
            src={movie.Poster || ''} /></div>
          <div>{movie.Title}</div>
          <div>{movie.Type}</div>
          <div>{movie.Year}</div>
          <div>{movie.Released}</div>
          <div>{movie.Genre}</div>
        </>
      )}

      {movie && movie.Ratings && movie.Ratings.map((rating) => (
        <div key={rating.Source}>
          {rating.Source}: {rating.Value}
        </div>
      ))}
    </>
  );
}
