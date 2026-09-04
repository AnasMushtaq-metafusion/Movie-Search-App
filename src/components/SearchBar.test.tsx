import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../components/SearchBar";

describe("SearchBar", () => {
  it("renders the search input and button", () => {
    render(
      <SearchBar searchTerm="" setSearchTerm={() => {}} onSearch={() => {}} />,
    );

    expect(screen.getByLabelText(/search for movies/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("calls setSearchTerm as the user types", async () => {
    const user = userEvent.setup();
    const setSearchTerm = vi.fn();

    render(
      <SearchBar
        searchTerm=""
        setSearchTerm={setSearchTerm}
        onSearch={() => {}}
      />,
    );

    await user.type(screen.getByLabelText(/search for movies/i), "Batman");
    expect(setSearchTerm).toHaveBeenCalled();
  });

  it("calls onSearch with the current term on submit", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(
      <SearchBar
        searchTerm="Batman"
        setSearchTerm={() => {}}
        onSearch={onSearch}
      />,
    );

    await user.click(screen.getByRole("button", { name: /search/i }));
    expect(onSearch).toHaveBeenCalledWith("Batman");
  });
});
