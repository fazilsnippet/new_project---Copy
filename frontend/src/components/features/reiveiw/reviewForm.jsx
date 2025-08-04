import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCreateReviewMutation } from "../../../redux/api/reviewApiSlice.js";
import { FaStar } from "react-icons/fa";

const ReviewForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();

      // Show popup
      setShowPopup(true);

      // Hide popup and navigate back
      setTimeout(() => {
        setShowPopup(false);
        navigate(-1);
      }, 1500);
    } catch (err) {
      alert(err?.data?.message || "Failed to submit review");
    }
  };

  return (
    <>
      {/* ✅ Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-2">✅ Review Submitted!</h3>
            <p className="text-gray-600">Redirecting back...</p>
          </div>
        </div>
      )}

      {/* ✅ Screen Freeze while loading */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white text-black px-6 py-4 rounded-lg shadow-lg">
            <p className="font-medium">Submitting your review...</p>
          </div>
        </div>
      )}

      {/* ✅ Review Form */}
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%]"
        >
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
          >
            ← Back
          </button>

          <h3 className="text-xl font-semibold mb-3">Leave a Review</h3>

          {/* Star Rating */}
          <div className="flex mb-4">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <button
                  type="button"
                  key={index}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(null)}
                  className="focus:outline-none"
                >
                  <FaStar
                    className={`w-8 h-8 transition-colors ${
                      starValue <= (hover || rating)
                        ? "text-yellow-400"
                        : "text-gray-500"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
            rows={4}
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 w-full"
          >
            {isLoading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ReviewForm;
