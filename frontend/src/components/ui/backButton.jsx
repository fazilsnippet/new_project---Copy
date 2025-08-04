import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="bg-orange-400 text-white px-4 py-1 rounded-md shadow hover:bg-orange-500 transition w-19 sm:w-auto"
    >
      Back
    </button>
  );
};

export default BackButton;
