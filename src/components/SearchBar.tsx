import { type FormEvent } from "react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: (query: string) => void;
}

const SearchBar = ({ searchTerm, setSearchTerm, onSearch }: SearchBarProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <label htmlFor="movie-search-input" className="sr-only">
        Search for movies, series, episodes
      </label>
      <input
        id="movie-search-input"
        type="text"
        placeholder="Search for movies, series, episodes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
        aria-label="Search for movies, series, episodes"
      />
      <button type="submit" className="search-button" aria-label="Search">
        🔍 Search
      </button>
    </form>
  );
};

export default SearchBar;
