import React from "react";
import type { BookVolume } from "../types/types";

const SearchPage: React.FC = () => {
   const [query, setQuery] = React.useState<string>('');
  const [books, setBooks] = React.useState<BookVolume[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [popularBooks, setPopularBooks] = React.useState<BookVolume[]>([]);
  const [popularLoading, setPopularLoading] = React.useState<boolean>(false);
  const [searchTimeoutId, setSearchTimeoutId] = React.useState<number | null>(null);

  

  return <div>SearchPage</div>;
};

export default SearchPage;
