// components/Hero.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import HeroProductCard from '../features/products/heroProductCard.jsx';
import { useGetProductsQuery } from '../../redux/api/productApiSlice.js';

const Hero = () => {
  const { data, isLoading, isError } = useGetProductsQuery({
    page: 1,
    limit: 5,
  });

  return (
    <section className="w-full bg-gradient-to-r from-orange-100 via-white to-orange-200 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Featured Products
        </h1>

        {isLoading && <p className="text-gray-500">Loading products...</p>}
        {isError && (
          <p className="text-red-500">Error fetching product data.</p>
        )}

        {data?.products && data.products.length > 0 && (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop
            className="rounded-xl"
          >
            {data.products.map((product) => (
              <SwiperSlide key={product._id}>
                <HeroProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default Hero;
