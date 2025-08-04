// src/components/SemanticSearch.jsx
import React, { useState } from 'react';
import { useSemanticSearchQuery } from '../../../redux/api/productApiSlice';

const ProductSemanticSearch = () => {
  const [query, setQuery] = useState('');
  const { data, isFetching, refetch } = useSemanticSearchQuery(query, {
    skip: true,
  });

  const handleSearch = () => {
    if (query.trim()) refetch();
  };

  return (
    <div>
      <h2><span className="icon icon-semantic" /> Semantic Search</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products naturally..."
      />
      <button onClick={handleSearch}>Search</button>
      {isFetching && <p>Loading...</p>}
      <div>
        {data?.map(product => (
          <div key={product._id}>{product.name}</div>
        ))}
      </div>
    </div>
  );
};

export  {ProductSemanticSearch};
