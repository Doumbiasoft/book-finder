import React, { useEffect, useState } from "react";
import type { BookVolume, SearchResponse } from "../types/types";
import UnitOfWork from "../api/unit-of-work";
import { Book, Search } from "lucide-react";
import BookGrid from "../components/BookGrid";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [books, setBooks] = useState<BookVolume[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [softwareBooks, setSoftwareBooks] = useState<BookVolume[]>([]);
  const [softwareBookLoading, setSoftwareBookLoading] =
    useState<boolean>(false);
  const [searchTimeoutId, setSearchTimeoutId] = useState<number | null>(null);

  const fetchSoftwareBooks = async () => {
    setSoftwareBookLoading(true);
    try {
      const response: SearchResponse = await UnitOfWork.book.getSoftwareBooks();
      setSoftwareBooks(response.items || []);
    } catch (err) {
      console.error("❌ Error fetching popular books:", err);
    } finally {
      setSoftwareBookLoading(false);
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

  useEffect(() => {
    fetchSoftwareBooks();

    return () => {
      if (searchTimeoutId) {
        clearTimeout(searchTimeoutId);
      }
    };
  }, []);
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Book className="w-10 h-10 text-yellow-400" />
          <h1 className="text-4xl font-bold text-gray-100">Book Finder</h1>
        </div>
        <p className="text-gray-400">
          Search millions of books using Google Books API
        </p>
      </div>

      <div className="mb-16">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search by title, author, or ISBN..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {books.length > 0 ? (
        <>
          <h2 className="text-2xl font-bold text-gray-100 mb-6">
            Search Results
          </h2>
          <BookGrid books={books} />
        </>
      ) : (
        !loading &&
        !error && (
          <>
            {softwareBookLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                  <p className="text-gray-400">
                    Loading software engineering books...
                  </p>
                </div>
              </div>
            ) : softwareBooks.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-100 mb-6">
                  Software Engineering Books
                </h2>
                <BookGrid books={softwareBooks} />
              </div>
            ) : (
              <div className="text-center py-16">
                <Book className="w-24 h-24 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Search for books to get started
                </p>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default SearchPage;
