import { useEffect, useState } from "react";
import "./App.css";
import MovieCard from "./MovieCard";

const apiKey = "e314295";

const movieIDs = [
  "tt0372784",
  "tt0848228",
  "tt4154796",
  "tt0241527",
  "tt0133093",
  "tt0468569",
];

function Home() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchDefaultMovies() {
      setLoading(true);
      try {
        const requests = movieIDs.map((id) =>
          fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`).then((res) =>
            res.json()
          )
        );

        const results = await Promise.all(requests);
        setMovies(results);
      } catch (error) {
        console.log("Error fetching default movies:", error);
      }
      setLoading(false);
    }

    async function fetchSearchMovies() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?s=${search}&apikey=${apiKey}`
        );
        const data = await res.json();
        setMovies(data.Search || []);
      } catch (error) {
        console.log("Error searching movies:", error);
      }
      setLoading(false);
    }

    if (search.trim() === "") {
      fetchDefaultMovies();
    } else {
      fetchSearchMovies();
    }
  }, [search]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movie) => {
    const exists = favorites.find((fav) => fav.imdbID === movie.imdbID);

    if (exists) {
      setFavorites(favorites.filter((fav) => fav.imdbID !== movie.imdbID));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  const isFavorite = (id) => {
    return favorites.some((fav) => fav.imdbID === id);
  };

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <div className="container">
        <div className="top-bar">
          <h1>🎬 Movie App</h1>
          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <input
          type="text"
          placeholder="Search movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <h2 className="section-title">
          {search.trim() === "" ? "Featured Movies" : "Search Results"}
        </h2>

        {loading ? (
          <p className="message">Loading...</p>
        ) : movies.length === 0 ? (
          <p className="message">No movies found.</p>
        ) : (
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                isFavorite={isFavorite(movie.imdbID)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}

        <h2 className="section-title">Favorites ({favorites.length})</h2>

        {favorites.length === 0 ? (
          <p className="message">No favorite movies yet.</p>
        ) : (
          <div className="movie-grid">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;