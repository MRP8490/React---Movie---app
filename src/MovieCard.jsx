function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  return (
    <div className="movie-card">
      <img src={movie.Poster} alt={movie.Title} />

      <div className="movie-info">
        <h3>{movie.Title}</h3>
        <p>📅 {movie.Year}</p>
        <p>🎭 {movie.Genre}</p>
        <p>⭐ {movie.imdbRating}</p>

        <button
          className="fav-btn"
          onClick={() => onToggleFavorite(movie)}
        >
          {isFavorite ? "❤️ Remove" : "🤍 Favorite"}
        </button>
      </div>
    </div>
  );
}

export default MovieCard;