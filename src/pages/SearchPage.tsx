import React from "react";
import type { BookVolume, SearchResponse } from "../types/types";
import UnitOfWork from "../api/unit-of-work";

const SearchPage: React.FC = () => {
  const [query, setQuery] = React.useState<string>("");
  const [books, setBooks] = React.useState<BookVolume[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [popularBooks, setPopularBooks] = React.useState<BookVolume[]>([]);
  const [popularLoading, setPopularLoading] = React.useState<boolean>(false);
  const [searchTimeoutId, setSearchTimeoutId] = React.useState<number | null>(
    null
  );

  const fetchPopularBooks = async () => {
    setPopularLoading(true);
    try {
      const response: SearchResponse = await UnitOfWork.book.getPopularBooks();
      setPopularBooks(response.items || []);
    } catch (err) {
      console.error("❌ Error fetching popular books:", err);
    } finally {
      setPopularLoading(false);
    }
  };
  const searchBooks = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response: SearchResponse = await UnitOfWork.book.searchBooks(
        searchQuery
      );

      setBooks(response.items || []);

      if (!response.items || response.items.length === 0) {
        setError("📚 No books found. Try a different search term.");
      }
    } catch (err) {
      setError("❌ Error searching for books. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return <div>SearchPage</div>;
};

export default SearchPage;
