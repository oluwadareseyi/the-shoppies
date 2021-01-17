import axios from "axios";
import React, { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import Loader from "../components/loader";
import useLocalStorage from "../hooks/useLocalStorage";
import { Link } from "react-router-dom";

const Home = () => {
  const [titleInput, setTitleInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [validYear, setValidYear] = useState(false);
  const [error, setError] = useState(false);
  const [ids, setIds] = useLocalStorage("nomid", []);
  const [nominees, setNominees] = useLocalStorage("nominees", []);
  const [sidebar, setSidebar] = useState(false);

  const debouncedTitle = useDebounce(titleInput, 2000);

  useEffect(() => {
    const year = validYear ? "&y=2018" : ""
    const url = `https://www.omdbapi.com/?s=${debouncedTitle.trim()}${year}&type=movie&apikey=30035024`;

    const fetcher = async () => {
      setLoading(true);
      const res = await axios.get(url);
      setResponse(res.data.Response.toLowerCase());
      setResults(res.data.Search);
      setLoading(false);
    };

    if (debouncedTitle.trim()) {
      fetcher();
    } else {
      setResults([]);
    }
  }, [debouncedTitle, validYear]);

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

  const submitHandler = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { year } = Object.fromEntries(formData);
    const isValidYear = year.trim().length === 4 && Number(year) < 2021;
    if (isValidYear) {
      setValidYear(true);
    } else {
      setError(true)
    }
  }

  const removeNomination = (movie) => {
    const newIds = ids.filter((item) => item !== movie.imdbID);
    const newNominees = nominees.filter((item) => item.imdbID !== movie.imdbID);
    setIds(newIds);
    setNominees(newNominees);
  }

  const sideBarHandler = () => {
    setSidebar(!sidebar)
    document.querySelector('body').classList.toggle('no-scroll');
  }

  const handleTitleChange = (e) => {
    setLoading(true);
    setTitleInput(e.target.value);
  };

  const handleYearChange = (e) => {
    setError(false);
    if (e.target.value.trim().length === 0) {
      setValidYear(false);
    }
  }

  const handleKeyDown = (e) => {
    let key = e.keyCode || e.charCode;
    if (key === 8 || key === 46) {
      setResults([]);
    }
  };

  return (
    <>
      <nav className="c-nav container">
        <Link to="/">
          <h3>Nominate</h3>
        </Link>
        <div className="nav-items">
          <button onClick={sideBarHandler}>Nominations List</button>
        </div>
      </nav>

      <div className={`c-page container`}>
        <div className={`c-banner ${ids.length === 5 ? "active" : ""}`}>You have made 5 nominations!</div>
        <form onSubmit={(e) => submitHandler(e)}>
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
              <label htmlFor="year" className="c-form__label">
                {error ? <span className="error">Please enter a valid year</span> : <span>Sort by year (optional)</span>}
              </label>
              <input
                className="c-form__input"
                autoComplete="off"
                type="number"
                id="year"
                name="year"
                placeholder="E.g. 2005"
                title="4 characters are expected"
                onChange={(e) => handleYearChange(e)}
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
              <div className="c-results__top">
                <h3>Search Results:</h3>
                <h4><span>Nominations:</span> {ids.length} / 5</h4>
              </div>
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
                          disabled={ids.length === 5 || ids.includes(movie.imdbID)}
                        >
                          {ids.includes(movie.imdbID) ? "Nominated" : ids.length === 5 ? "Limit Reached" : "Nominate"}
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
      <div className={`${sidebar ? "active" : ""} c-sidebar`}>
        <div className="btn-wrapper">
          <button onClick={sideBarHandler}>Close</button>
        </div>
        <div className="c-page c-nominees">
          <div className="notification">You have <b>{5 - ids.length} nominations</b> left</div>
          {nominees && nominees.length > 0 ? (
            <>
              <h3>Nominations List:</h3>
              <div className="c-grid">
                {nominees.map(movie => (
                  <div className="c-box" key={movie.imdbID}>
                    <div className="poster">
                      {movie.Poster === "N/A" ? (
                        <div className="poster-empty">{movie.Title}</div>
                      ) : (
                          <img src={movie.Poster} alt={movie.Title} />
                        )}
                    </div>
                    <button
                      className="nominate"
                      onClick={() => removeNomination(movie)}
                    >
                      Remove
              </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
              <div className="c-empty">
                <div className="c-empty__content">
                  <h2>You haven't made any nominations</h2>
                </div>
              </div>
            )}
        </div>
      </div>

      <div onClick={sideBarHandler} className={`${sidebar ? "active" : ""} c-backdrop`}></div>
    </>

  );
};

export default Home;
