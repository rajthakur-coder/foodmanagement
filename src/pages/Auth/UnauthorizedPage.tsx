// src/pages/Auth/UnauthorizedPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-white">{" "}
      <h1 className="mb-2 text-4xl font-bold text-gray-900">
        Sorry, page not found!
      </h1>{" "}
      <p className="max-w-md mb-8 text-center text-gray-500">Sorry, we couldn’t find the page you’re looking for. Perhaps
        you’ve mistyped the URL? Be sure to check your spelling. {" "}
      </p> {/* 404 illustration */}
      {" "}
      <div className="mb-8">
         <div className="text-6xl text-gray-400">404 Not Found</div>{" "}
      </div>
     {" "}
      <button
        onClick={goBack}
        className="px-6 py-3 text-white transition bg-black rounded-lg hover:bg-gray-800"
      >
        Go back {" "}
      </button>
     {" "}
    </div>
  );
};

export default UnauthorizedPage;
