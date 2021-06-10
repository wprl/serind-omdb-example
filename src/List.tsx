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

export default function List() {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState<Array<ImdbData>>([]);
  const [searchUrl, setSearchUrl] = useState('');

  useEffect(() => {
    if (!searchUrl) {
      setIsLoaded(true);
      setErrorMessage('');
      setItems([]);
      return;
    }

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
          setItems([]);
        }
      )
  }, [searchUrl])

  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [year, setYear] = useState('');

  const buildSearchUrl = () => {
    const trimmedTitle = title.trim()

    if (!trimmedTitle) return ''

    const url = new URL(omdbSearchUrl)
    url.searchParams.append('apikey', omdbApiKey)
    url.searchParams.append('s', trimmedTitle)

    if (year) url.searchParams.append('y', year)
    if (type) url.searchParams.append('type', type)

    return url.toString()
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSearchUrl(buildSearchUrl())
        }}>
        <label>
          Title:
          <input
            type="text"
            minLength={1}
            onChange={(e) => setTitle(e.target.value)}
            required={true}
            value={title}
          />
        </label>

        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Any</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="episode">Episode</option>
          </select>
        </label>

        <label>
          Year:
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

      {errorMessage && (
        <div>Error: {errorMessage}</div>
      )}

      <table>
        <tbody>
          {items.map(item => (
            <tr key={item.imdbID}>
              <td>
                <img
                  alt={'Poster image for ' + item.Title}
                  width="100px"
                  src={item.Poster || noPosterImageUrl} />
              </td>
              <td>{item.Title}</td>
              <td>{item.Type}</td>
              <td>{item.Year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
