import React, { useState } from 'react';
import { useVoiceSearchMutation } from '../../../redux/api/productApiSlice';

const ProductVoiceSearch = () => {
  const [file, setFile] = useState(null);
  const [searchVoice, { data, isLoading, error }] = useVoiceSearchMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('audio', file);
    await searchVoice(formData);
  };

  return (
    <div>
      <h2><span className="icon icon-voice" /> Voice Search</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Search</button>
      </form>
      {isLoading && <p>Processing...</p>}
      {error && <p>Error: {error.message}</p>}
      <div>
        {data?.map(product => (
          <div key={product._id}>{product.name}</div>
        ))}
      </div>
    </div>
  );
};

export  {ProductVoiceSearch};