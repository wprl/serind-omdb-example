import React, { useEffect, useState } from 'react';

const omdbApiKey = 'c4de1ece'
const omdbSearchUrl = `http://www.omdbapi.com/`

interface ImdbData {
  imdbID: string,
  Title: string,
  Year: number
}

interface ImdbResponse {
  Error?: string,
  Response: string,
  Search: Array<ImdbData>
}

export default function List() {
  const buildSearchUrl = () => {
    const url = new URL(omdbSearchUrl)
    url.search = new URLSearchParams({
      apikey: omdbApiKey,
      s: title
      // year, type
    }).toString()

    return url.toString()
  }

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState<Array<ImdbData>>([]);
  const [title, setTitle] = useState('Monkey King');
  const [type, setType] = useState('');
  const [year, setYear] = useState('');
  const [searchUrl, setSearchUrl] = useState(buildSearchUrl());

  useEffect(() => {
    fetch(searchUrl)
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

          if (result.Response === 'False') {
            setErrorMessage(result.Error || 'Request ERROR');
            setItems([]);
          }
          else {
            setErrorMessage('');
            setItems(result.Search);
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setErrorMessage(error.message);
        }
      )
  }, [searchUrl])

  return (
    <div>
      <label>
        Title:
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </label>

      <label>
        Type:
        <input
          type="text"
          onChange={(e) => setType(e.target.value)}
          value={type}
        />
      </label>

      <label>
        Year:
        <input
          type="text"
          onChange={(e) => setYear(e.target.value)}
          value={year}
        />
      </label>

      <button onClick={() => setSearchUrl(buildSearchUrl())}>
        Search
      </button>

      {!isLoaded && (
        <div>Loading...</div>
      )}

      {errorMessage && (
        <div>Error: {errorMessage}</div>
      )}

      <ul>
        {items.map(item => (
          <li key={item.imdbID}>
            {item.Title} ({item.Year})
          </li>
        ))}
      </ul>
    </div>
  );
}
