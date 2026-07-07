interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const posterUrl =
    movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/400x600/1a1a2e/eee?text=No+Image";

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img src={posterUrl} alt={movie.Title} />
        <div className="movie-type">{movie.Type}</div>
      </div>
      <div className="movie-info">
        <h3>{movie.Title}</h3>
        <p className="year">📅 {movie.Year}</p>
      </div>
    </div>
  );
};

export default MovieCard;
