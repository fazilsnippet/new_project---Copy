import React, { useState, useRef, useCallback } from "react";
import { useGetAllReviewsQuery } from "../../../redux/api/reviewApiSlice.js";
import { FaStar } from "react-icons/fa";

const AllReviewsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = useGetAllReviewsQuery({ limit, page });
  const [reviews, setReviews] = useState([]);

  // Append new reviews when page changes
  React.useEffect(() => {
    if (data?.reviews) {
      setReviews((prev) => [...prev, ...data.reviews]);
    }
  }, [data]);

  // Infinite scroll observer
  const observer = useRef();
  const lastReviewRef = useCallback((node) => {
    if (isFetching) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && data?.currentPage < data?.totalPages) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [isFetching, data]);

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">All Reviews</h2>

      {reviews.map((review, idx) => (
        <div
          key={review._id}
          ref={idx === reviews.length - 1 ? lastReviewRef : null}
          className="border-b border-gray-700 pb-3 mb-3"
        >
          <div className="flex justify-between items-center">
            <span className="font-bold">{review.user?.name}</span>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < review.rating ? "text-yellow-400" : "text-gray-500"}
                />
              ))}
            </div>
          </div>
          <p className="text-gray-300 mt-1">{review.comment}</p>
          <p className="text-sm text-gray-500">Product: {review.product?.name}</p>
        </div>
      ))}

      {isLoading && <p className="text-gray-400">Loading reviews...</p>}
      {isFetching && <p className="text-gray-400">Loading more...</p>}
    </div>
  );
};

export default AllReviewsPage;
