import { useEffect, useState } from "react";
import "./App.css";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";

const API_KEY = "6d157d75";
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

interface ApiResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setMovies([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}&s=${encodeURIComponent(query)}`);
      const data: ApiResponse = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError("No movies found. Try a different search!");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchMovies("Spider-Man");
  }, []);

  return (
    <div className="app">
      <div className="header">
        <h1>
          <span className="emoji">🎬</span> MovieFlix
        </h1>
        <p className="subtitle">Discover your favorite movies</p>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={searchMovies}
      />

      <div className="container">
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Searching for movies...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error">
            <span className="emoji">😕</span>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}

        {!loading && !error && movies.length === 0 && !searchTerm && (
          <div className="empty-state">
            <span className="emoji">🍿</span>
            <p>Start searching for your favorite movies!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
