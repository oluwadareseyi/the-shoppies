import axios from "axios";
import React, { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import Loader from "../components/loader";
import useLocalStorage from "../hooks/useLocalStorage";

const Home = () => {
  const [titleInput, setTitleInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [ids, setIds] = useLocalStorage("nomid", []);
  const [nominees, setNominees] = useLocalStorage("nominees", []);

  const debouncedTitle = useDebounce(titleInput, 2000);

  const nominate = (movie) => {
    if (ids.includes(movie.imdbID)) {
      return;
    } else {
      if (ids.length === 5) return;
      const newIds = [...ids, movie.imdbID];
      const newNominees = [...nominees, movie];
      setNominees(newNominees)
      setIds(newIds);
    }
  };

  useEffect(() => {
    const url = `https://www.omdbapi.com/?s=${debouncedTitle.trim()}&type=movie&apikey=30035024`;

    const fetcher = async () => {
      setLoading(true);
      const res = await axios.get(url);
      setResponse(res.data.Response.toLowerCase());
      setResults(res.data.Search);
      setLoading(false);
      console.log(res.data);
    };

    if (debouncedTitle.trim()) {
      fetcher();
    } else {
      setResults([]);
    }
  }, [debouncedTitle]);

  const handleTitleChange = (e) => {
    setLoading(true);
    setTitleInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    let key = e.keyCode || e.charCode;
    if (key === 8 || key === 46) {
      setResults([]);
    }
  };

  return (
    <div className="c-page">
      <div className={`c-banner ${ids.length === 5 ? "active" : ""}`}>You have made 5 nominations!</div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="input-row">
          <div className="title-input">
            <label htmlFor="searchTitle" className="c-form__label">
              Search
            </label>
            <input
              required
              value={titleInput}
              onChange={(e) => handleTitleChange(e)}
              className="c-form__input"
              placeholder="Enter movie title"
              autoComplete="off"
              type="text"
              id="searchTitle"
              name="searchTitle"
              onKeyDown={(e) => handleKeyDown(e)}
            />
          </div>
          <div className="year-input">
            <label htmlFor="searchYear" className="c-form__label">
              Sort by year (optional)
            </label>
            <input
              className="c-form__input"
              autoComplete="off"
              type="number"
              id="searchYear"
              name="searchTitle"
              placeholder="E.g. 2005"
              title="4 characters are expected"
            />
          </div>

          <button className="c-form__button">
            <span>Search</span>
          </button>
        </div>
      </form>

      {titleInput.trim().length <= 0 && (
        <div className="c-empty">
          <div className="c-empty__content">
            <h2>Please enter a search keyword</h2>
          </div>
        </div>
      )}

      {titleInput.trim().length > 0 && (
        <div className="c-page__main">
          <div className="c-results">
            <h2>Search Results:</h2>
            {!loading ? (
              <div className="c-grid">
                {response === "true" &&
                  results &&
                  results.map((movie) => (
                    <div
                      className={`c-box ${ids.includes(movie.imdbID) ? "nominated" : ""
                        }`}
                      key={movie.imdbID}
                    >
                      <div className="poster">
                        {movie.Poster === "N/A" ? (
                          <div className="poster-empty">{movie.Title}</div>
                        ) : (
                            <img src={movie.Poster} alt={movie.Title} />
                          )}
                      </div>
                      <button
                        className="nominate"
                        onClick={() => nominate(movie)}
                        disabled={ids.includes(movie.imdbID)}
                      >
                        {ids.includes(movie.imdbID) ? "Nominated" : "Nominate"}
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
                <div className="c-loading">
                  <Loader />
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
