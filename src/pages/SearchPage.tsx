import React, { useState } from "react";
import type { BookVolume, SearchResponse } from "../types/types";
import UnitOfWork from "../api/unit-of-work";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [books, setBooks] = useState<BookVolume[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [popularBooks, setPopularBooks] = useState<BookVolume[]>([]);
  const [popularLoading, setPopularLoading] = useState<boolean>(false);
  const [searchTimeoutId, setSearchTimeoutId] = useState<number | null>(null);

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
  const handleSearch = () => {
    searchBooks(query);
  };
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);

    if (searchTimeoutId) {
      clearTimeout(searchTimeoutId);
    }

    if (!newQuery.trim()) {
      setBooks([]);
      setError("");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      searchBooks(newQuery);
    }, 500);

    setSearchTimeoutId(timeoutId);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchTimeoutId) {
        clearTimeout(searchTimeoutId);
      }
      handleSearch();
    }
  };
  return <div>SearchPage</div>;
};

export default SearchPage;
