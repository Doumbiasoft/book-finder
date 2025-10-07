import { useNavigate } from "react-router-dom";
import type { BookVolume } from "../types/types";
import { Book } from "lucide-react";

const BookGrid: React.FC<{ books: BookVolume[] }> = ({ books }) => {
  const navigate = useNavigate();

  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <div
          key={book.id}
          onClick={() => handleBookClick(book.id)}
          className="bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden transform hover:-translate-y-1 border border-gray-700"
        >
          <div className="h-48 bg-gray-900 flex items-center justify-center overflow-hidden">
            {book.volumeInfo.imageLinks?.thumbnail ? (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={book.volumeInfo.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <Book className="w-16 h-16 text-gray-600" />
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-100 mb-2 line-clamp-2 min-h-[3rem]">
              {book.volumeInfo.title}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-1">
              {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
            </p>
            {book.volumeInfo.publishedDate && (
              <p className="text-xs text-gray-500 mt-1">
                {new Date(book.volumeInfo.publishedDate).getFullYear()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
export default BookGrid;
