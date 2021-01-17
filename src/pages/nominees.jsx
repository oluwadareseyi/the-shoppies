import React from "react";
import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";

const Nominees = () => {
  const [ids, setIds] = useLocalStorage("nomid", []);
  const [nominees, setNominees] = useLocalStorage("nominees", []);
  const removeNomination = (movie) => {
    const newIds = ids.filter((item) => item !== movie.imdbID);
    const newNominees = nominees.filter((item) => item.imdbID !== movie.imdbID);
    setIds(newIds);
    setNominees(newNominees);
  }
  return (
    <div className="c-page c-nominees">
      {nominees && nominees.length > 0 ? (
        <>
          <h2>Nominations List:</h2>
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
              <Link to="/">
                <button>
                  Go Home
               </button>
              </Link>
            </div>
          </div>
        )}
    </div>
  );
};

export default Nominees;
