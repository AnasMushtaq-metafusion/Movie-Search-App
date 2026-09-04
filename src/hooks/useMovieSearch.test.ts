import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useMovieSearch } from "./useMovieSearch";

function jsonResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe("useMovieSearch", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("populates movies on a successful search", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        Search: [
          {
            imdbID: "tt1",
            Title: "Batman",
            Year: "1989",
            Poster: "N/A",
            Type: "movie",
          },
        ],
        totalResults: "1",
        Response: "True",
      }),
    );

    const { result } = renderHook(() => useMovieSearch());

    act(() => {
      result.current.search("batman");
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.movies).toHaveLength(1);
    expect(result.current.error).toBe("");
    expect(result.current.totalResults).toBe(1);
  });

  it("surfaces the API error message when no results are found", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        Search: [],
        totalResults: "0",
        Response: "False",
        Error: "Movie not found!",
      }),
    );

    const { result } = renderHook(() => useMovieSearch());

    act(() => {
      result.current.search("zzzzzz");
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.movies).toHaveLength(0);
    expect(result.current.error).toBe("Movie not found!");
  });

  it("surfaces a generic error when the request fails", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("network down"));

    const { result } = renderHook(() => useMovieSearch());

    act(() => {
      result.current.search("batman");
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(
      "Something went wrong. Please try again.",
    );
  });

  it("clears results when the query is empty", async () => {
    const { result } = renderHook(() => useMovieSearch());

    act(() => {
      result.current.search("   ");
    });

    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.movies).toHaveLength(0);
  });
});
