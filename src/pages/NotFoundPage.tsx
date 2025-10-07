import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
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
            Go Back
          </button>
        </div>

        <div className="rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <h1 className="text-9xl text-yellow-500 font-extrabold">404</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
