import React, { useState } from 'react';
import { useVisualSearchMutation } from '../../../redux/api/productApiSlice';

const ProductVisualSearch = () => {
  const [file, setFile] = useState(null);
  const [searchProducts, { data, isLoading, error }] = useVisualSearchMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    await searchProducts(formData);
  };

  return (
    <div>
      <h2><span className="icon icon-visual" /> Visual Search</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Search</button>
      </form>
      {isLoading && <p>Searching...</p>}
      {error && <p>Error: {error.message}</p>}
      <div>
        {data?.map(product => (
          <div key={product._id}>{product.name}</div>
        ))}
      </div>
    </div>
  );
};

export  {ProductVisualSearch};