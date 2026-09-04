import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import MovieCard from "../components/MovieCard";
import type { Movie } from "../types/movie";

const baseMovie: Movie = {
  imdbID: "tt0145487",
  Title: "Spider-Man",
  Year: "2002",
  Poster: "https://example.com/poster.jpg",
  Type: "movie",
};

describe("MovieCard", () => {
  it("renders the movie title, year and type", () => {
    render(<MovieCard movie={baseMovie} />);

    expect(screen.getByText("Spider-Man")).toBeInTheDocument();
    expect(screen.getByText(/2002/)).toBeInTheDocument();
    expect(screen.getByText("movie")).toBeInTheDocument();
  });

  it("uses the poster URL when available", () => {
    render(<MovieCard movie={baseMovie} />);

    const img = screen.getByAltText("Spider-Man") as HTMLImageElement;
    expect(img.src).toBe(baseMovie.Poster);
  });

  it("falls back to a local placeholder when the poster is N/A", () => {
    render(<MovieCard movie={{ ...baseMovie, Poster: "N/A" }} />);

    const img = screen.getByAltText("Spider-Man") as HTMLImageElement;
    expect(img.src).not.toBe("N/A");
    expect(img.src).not.toBe(baseMovie.Poster);
    expect(img.src.length).toBeGreaterThan(0);
  });
});
