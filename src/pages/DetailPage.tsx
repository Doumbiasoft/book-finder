import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { BookVolume } from "../types/types";
import unitOfWork from "../api/unit-of-work";

const DetailPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = React.useState<BookVolume | null>(
    null
  );
  const [detailLoading, setDetailLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

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

  return <div>DetailPage</div>;
};

export default DetailPage;
