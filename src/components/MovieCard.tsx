import { memo } from "react";
import type { Movie } from "../types/movie";
import noPoster from "../assets/no-poster.svg";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const posterUrl = movie.Poster !== "N/A" ? movie.Poster : noPoster;

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img
          src={posterUrl}
          alt={movie.Title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = noPoster;
          }}
        />
        <div className="movie-type">{movie.Type}</div>
      </div>
      <div className="movie-info">
        <h3>{movie.Title}</h3>
        <p className="year">📅 {movie.Year}</p>
      </div>
    </div>
  );
};

export default memo(MovieCard);
