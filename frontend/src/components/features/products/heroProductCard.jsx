// components/HeroProductCard.jsx
import React from 'react';
import { useNavigate } from 'react-router';

const HeroProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      className="relative w-full h-[22rem] sm:h-[28rem] md:h-[32rem] cursor-pointer overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-[1.01]"
    >
      <img
      src={product.images?.[0]}
        alt={product.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white p-4">
        <h2 className="text-lg font-bold">{product.name}</h2>
        <p className="text-sm text-gray-200 line-clamp-2">
          {product.description}
        </p>
      </div>
    </div>
  );
};

export default HeroProductCard;
