// import React, { useState } from 'react';
// import { useCreateReviewMutation } from '../../../redux/api/reviewApiSlice.js';

// const ProductReview = ({ productId, reviews }) => {
//   const [rating, setRating] = useState(0);
//   const [review, setReview] = useState('');
//   const [createReview] = useCreateReviewMutation();

//   const handleSubmit = async () => {
//     await createReview({ productId, review: { rating, review } });
//   };

//   return (
//     <div className="product-review">
//       <h3>Reviews</h3>
//       {reviews.map((r) => (
//         <div key={r._id} className="review-item">
//           <p>{r.review}</p>
//           <p>Rating: {r.rating}</p>
//         </div>
//       ))}
//       <div className="add-review">
//         <h4>Add a Review</h4>
//         <input
//           type="number"
//           placeholder="Rating"
//           value={rating}
//           onChange={(e) => setRating(e.target.value)}
//         />
//         <textarea
//           placeholder="Review"
//           value={review}
//           onChange={(e) => setReview(e.target.value)}
//         />
//         <button onClick={handleSubmit}>Submit</button>
//       </div>
//     </div>
//   );
// };

// export default ProductReview;
// // make a component that add a feature that user who bought the item, he can only review . first write  controller for reviews and then come here....

import React, { useState } from 'react';
import { useCreateReviewMutation } from '../../../redux/api/reviewApiSlice.js';

const ProductReview = ({ productId, reviews }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [createReview, { isLoading, error, isSuccess }] = useCreateReviewMutation();

  const handleSubmit = async () => {
    try {
      await createReview({ productId, rating, comment }).unwrap();
      alert("Review submitted successfully.");
      setRating(0);
      setComment('');
    } catch (err) {
      alert(err?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="product-review">
      <h3>Reviews</h3>
      {reviews.map((r) => (
        <div key={r._id} className="review-item">
          <p>{r.comment}</p>
          <p>Rating: {r.rating}</p>
        </div>
      ))}
      <div className="add-review">
        <h4>Add a Review</h4>
        <input
          type="number"
          placeholder="Rating"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
        <textarea
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
        {error && <p style={{ color: 'red' }}>{error.data?.message || 'Error occurred'}</p>}
      </div>
    </div>
  );
};

export default ProductReview;
