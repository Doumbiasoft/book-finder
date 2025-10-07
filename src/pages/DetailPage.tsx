import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { BookVolume } from "../types/types";

const DetailPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = React.useState<BookVolume | null>(null);
  const [detailLoading, setDetailLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');


  
  return <div>DetailPage</div>;
};

export default DetailPage;
