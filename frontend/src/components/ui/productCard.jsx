import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../redux/api/productApiSlice';
import { useAddRecentlyViewedProductMutation } from '../../redux/api/userApiSlice';
import AddToCart from '../features/cart/AddToCart';
import DashboardMenu from '../layout/header';
import RecentlyViewedPreview from '../features/products/recentlyViewPreview';
import CategoryProductsSlider from '../features/products/categoryProductSlider.jsx'
import ReviewsPreview from '../features/reiveiw/reviewPreview.jsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ProductCard = () => {
  const { productId } = useParams();
  const { data, isLoading, isError } = useGetProductByIdQuery(productId);
  const [quantity, setQuantity] = useState(1);
  const swiperRef = useRef(null);
  const [addRecentlyViewedProduct] = useAddRecentlyViewedProductMutation();
const navigate = useNavigate()
  useEffect(() => {
    if (productId) {
      addRecentlyViewedProduct(productId).catch((err) => {
        console.error('Failed to add recently viewed product:', err);
      });
    }
  }, [productId, addRecentlyViewedProduct]);

  const product = data || {};
  const {
    name,
    brand,
    description,
    price,
    stock,
    ratings = [],
    images = [],
  } = product;

  const averageRating = ratings.length
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 0;

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Failed to load product.</div>;

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <DashboardMenu />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="w-full lg:w-1/2 relative">
          <Swiper
            modules={[Navigation]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={20}
            slidesPerView={1}
            className="rounded-lg overflow-hidden"
          >
            {images.map((url, index) => (
              <SwiperSlide key={index}>
                <div className="py-6 flex justify-center">
                  <div className="w-[90%] sm:w-[80%] h-[250px] sm:h-[320px] bg-white rounded-lg overflow-hidden shadow flex items-center justify-center">
                    {url.endsWith('.mp4') ? (
                      <video
                        controls
                        className="w-full h-full object-contain rounded-lg"
                      >
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={url}
                        alt={`Product ${index}`}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Swiper Navigation */}
          <button
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 z-10"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            ◀
          </button>
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 z-10"
            onClick={() => swiperRef.current?.slideNext()}
          >
            ▶
          </button>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
          <p className="text-gray-600">{description}</p>

          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-blue-600">₹{price}</span>
            <span className="text-sm text-gray-500">Brand: {brand}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-yellow-500">⭐ {averageRating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({stock} in stock)</span>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="qty" className="text-sm font-medium text-gray-700">
              Quantity:
            </label>
            <select
              id="qty"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[...Array(Math.min(stock, 10)).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden lg:flex gap-4 mt-6">
            <div className="w-full rounded bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 transition hover:scale-105">
              <AddToCart productId={product._id} quantity={quantity} />
            </div>
            <Link to="/cart">
              <button className="w-full rounded bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:scale-105">
                Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Description Blocks */}
      {product.descriptionBlocks?.length > 0 && (
        <div className="mt-12 space-y-10">
          <h2 className="text-2xl font-bold">More About This Product</h2>
          {product.descriptionBlocks.map((block, idx) => (
            <div
              key={idx}
              className={`flex flex-col md:flex-row ${
                block.layout === 'rightToLeft' ? 'md:flex-row-reverse' : ''
              } items-center gap-6`}
            >
              <img
                src={block.image}
                alt={`Block ${idx}`}
                className="w-full md:w-1/2 h-auto object-cover rounded-lg shadow"
              />
              <p className="text-gray-700 w-full md:w-1/2 text-lg">{block.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Mobile Sticky Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow p-4 flex justify-between items-center gap-4 lg:hidden z-50">
        <div className="w-full">
          <AddToCart productId={product._id} quantity={quantity} />
        </div>
        <Link to="/cart" className="w-full">
          <button className="w-full rounded bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:scale-105">
            Checkout
          </button>
        </Link>
      </div>
      
      <div>

     {product?._id && (
  <button
    onClick={() => navigate(`/review/create/${product._id}`)}
    className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded mt-2"
  >
    Add Review
  </button>
)}
<div>
  {product?._id && <ReviewsPreview productId={product._id} />}

</div>


      </div>

      <div className='mt-16'><CategoryProductsSlider
  category={product?.category}
  currentProductId={product?._id}
/></div>
      {/* Recently Viewed Products */}
      <div className="mt-16">
        <RecentlyViewedPreview />
      </div>
    </section>
  );
};

export default ProductCard;
