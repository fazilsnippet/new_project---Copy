import React, { useState } from "react";
import { useGetProductReviewsQuery } from "../../../redux/api/reviewApiSlice.js";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const MAX_LENGTH = 100; // characters before collapsing

const ReviewsPreview = ({ productId }) => {
  const { data: reviews = [], isLoading, isError } = useGetProductReviewsQuery({ productId, limit: 5 });
  const [expandedReviewIds, setExpandedReviewIds] = useState([]);

  const toggleExpand = (id) => {
    setExpandedReviewIds((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  if (isLoading) return <p className="text-gray-500">Loading reviews...</p>;
  if (isError) return <p className="text-red-500">Failed to load reviews</p>;

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg mt-8">
      <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>

      {reviews.length === 0 && <p className="text-gray-400">No reviews yet.</p>}

      {reviews.map((review) => {
        const isExpanded = expandedReviewIds.includes(review._id);
        const needsCollapse = review.comment?.length > MAX_LENGTH;
        const displayComment = isExpanded
          ? review.comment
          : review.comment?.slice(0, MAX_LENGTH) + (needsCollapse ? "..." : "");

        return (
          <div key={review._id} className="border-b border-gray-700 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold">{review.user?.name || "Anonymous"}</span>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < review.rating ? "text-yellow-400" : "text-gray-500"}
                  />
                ))}
              </div>
            </div>
          <p
  className="text-gray-300 mt-1 break-words whitespace-pre-wrap max-w-full overflow-hidden"
>
  {displayComment}{" "}
  {needsCollapse && (
    <button
      onClick={() => toggleExpand(review._id)}
      className="text-yellow-400 hover:underline ml-1"
    >
      {isExpanded ? "Show less" : "Read more"}
    </button>
  )}
</p>

          </div>
        );
      })}

      {reviews.length === 5 && (
        <Link
          to={`/review/${productId}`}
          className="text-yellow-400 hover:underline mt-3 inline-block"
        >
          View all reviews →
        </Link>
      )}
    </div>
  );
};

export default ReviewsPreview;
