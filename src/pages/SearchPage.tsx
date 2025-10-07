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

  return <div>SearchPage</div>;
};

export default SearchPage;
