import React, { useEffect, useState } from 'react';

const omdbApiKey = 'c4de1ece'
const omdbSearchUrl = `http://www.omdbapi.com/`

interface ImdbData {
  imdbID: string,
  Title: string,
  Year: number
}

interface ImdbResponse {
  Search: Array<ImdbData>
}

export default function List() {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState<Array<ImdbData>>([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    const searchUrl = new URL(omdbSearchUrl)
    searchUrl.search = new URLSearchParams({
      apikey: omdbApiKey,
      s: 'Monkey King'
    }).toString()

    fetch(searchUrl.toString())
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return response.json() as Promise<ImdbResponse>
      })
      .then(
        (result) => {
          console.log({result})
          setIsLoaded(true);
          setItems(result.Search);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setErrorMessage(error.message);
        }
      )
  }, [])

  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <ul>
        {items.map(item => (
          <li key={item.imdbID}>
            {item.Title} ({item.Year})
          </li>
        ))}
      </ul>
    );
  }
}
