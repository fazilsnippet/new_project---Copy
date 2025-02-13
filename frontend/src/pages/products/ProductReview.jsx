import React, { useState } from 'react';
import { useCreateReviewMutation } from '../../redux/api/productApiSlice';
import './ProductReview.css'; // Import the CSS file

const ProductReview = ({ productId, reviews }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [createReview] = useCreateReviewMutation();

  const handleSubmit = async () => {
    await createReview({ productId, review: { rating, review } });
  };

  return (
    <div className="product-review">
      <h3>Reviews</h3>
      {reviews.map((r) => (
        <div key={r._id} className="review-item">
          <p>{r.review}</p>
          <p>Rating: {r.rating}</p>
        </div>
      ))}
      <div className="add-review">
        <h4>Add a Review</h4>
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <textarea
          placeholder="Review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default ProductReview;