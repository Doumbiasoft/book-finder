import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { BookVolume } from "../types/types";
import unitOfWork from "../api/unit-of-work";
import { ArrowLeft, Book, ExternalLink } from "lucide-react";

const DetailPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<BookVolume | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchBookDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const response: BookVolume = await unitOfWork.book.getBookDetail(id);

      setSelectedBook(response);
    } catch (err) {
      console.error("❌ Error fetching book details:", err);
      setError("❌ Error loading book details");
    } finally {
      setDetailLoading(false);
    }
  };
  useEffect(() => {
    if (bookId) {
      fetchBookDetail(bookId);
    }
  }, [bookId]);

  const goBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-100 rounded-lg hover:bg-gray-700 transition-colors shadow-lg border border-gray-700 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-yellow-500" />
            Back to Search
          </button>
          <div className="flex items-center gap-2">
            <Book className="w-6 h-6 text-yellow-500" />
            <h1 className="text-2xl font-bold text-gray-100">Book Details</h1>
          </div>
        </div>

        {detailLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading book details...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-900 border border-red-700 rounded-lg text-red-200 mb-6">
            {error}
          </div>
        )}

        {!detailLoading && selectedBook && (
          <div className="bg-gray-800 rounded-lg shadow-2xl p-6 md:p-8 border border-gray-700">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="bg-gray-900 rounded-lg overflow-hidden aspect-[2/3] flex items-center justify-center sticky top-8 border border-gray-700">
                  {selectedBook.volumeInfo.imageLinks?.thumbnail ? (
                    <img
                      src={selectedBook.volumeInfo.imageLinks.thumbnail
                        .replace("&edge=curl", "")
                        .replace("zoom=1", "zoom=2")}
                      alt={selectedBook.volumeInfo.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Book className="w-24 h-24 text-gray-600" />
                  )}
                </div>
              </div>

              <div className="md:w-2/3">
                <h2 className="text-4xl font-bold text-gray-100 mb-3">
                  {selectedBook.volumeInfo.title}
                </h2>

                {selectedBook.volumeInfo.authors && (
                  <p className="text-xl text-gray-400 mb-6">
                    by {selectedBook.volumeInfo.authors.join(", ")}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  {selectedBook.volumeInfo.publisher && (
                    <div>
                      <span className="text-sm font-semibold text-gray-500 uppercase">
                        Publisher
                      </span>
                      <p className="text-gray-300 mt-1">
                        {selectedBook.volumeInfo.publisher}
                      </p>
                    </div>
                  )}
                  {selectedBook.volumeInfo.publishedDate && (
                    <div>
                      <span className="text-sm font-semibold text-gray-500 uppercase">
                        Published
                      </span>
                      <p className="text-gray-300 mt-1">
                        {selectedBook.volumeInfo.publishedDate}
                      </p>
                    </div>
                  )}
                  {selectedBook.volumeInfo.pageCount && (
                    <div>
                      <span className="text-sm font-semibold text-gray-500 uppercase">
                        Pages
                      </span>
                      <p className="text-gray-300 mt-1">
                        {selectedBook.volumeInfo.pageCount}
                      </p>
                    </div>
                  )}
                  {selectedBook.volumeInfo.language && (
                    <div>
                      <span className="text-sm font-semibold text-gray-500 uppercase">
                        Language
                      </span>
                      <p className="text-gray-300 mt-1">
                        {selectedBook.volumeInfo.language.toUpperCase()}
                      </p>
                    </div>
                  )}
                  {selectedBook.volumeInfo.averageRating && (
                    <div>
                      <span className="text-sm font-semibold text-gray-500 uppercase">
                        Rating
                      </span>
                      <p className="text-gray-300 mt-1">
                        ⭐ {selectedBook.volumeInfo.averageRating} / 5
                        {selectedBook.volumeInfo.ratingsCount &&
                          ` (${selectedBook.volumeInfo.ratingsCount.toLocaleString()} ratings)`}
                      </p>
                    </div>
                  )}
                </div>

                {selectedBook.volumeInfo.categories &&
                  selectedBook.volumeInfo.categories.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                        Categories
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedBook.volumeInfo.categories.map((cat, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-yellow-900 text-yellow-300 rounded-full text-sm font-medium border border-yellow-800"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {selectedBook.volumeInfo.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-100 mb-3">
                      About This Book
                    </h3>
                    <div
                      className="text-gray-400 leading-relaxed prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: selectedBook.volumeInfo.description,
                      }}
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-700">
                  {selectedBook.volumeInfo.previewLink && (
                    <a
                      href={selectedBook.volumeInfo.previewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Preview Book
                    </a>
                  )}
                  {selectedBook.volumeInfo.infoLink && (
                    <a
                      href={selectedBook.volumeInfo.infoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 border-2 border-yellow-500 text-yellow-400 rounded-lg hover:bg-yellow-950 transition-colors font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      More Info
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
