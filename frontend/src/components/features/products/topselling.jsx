import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLazyGetTopSellingProductsQuery } from "../../../redux/api/productApiSlice.js";
import { useSearchParams, Link } from "react-router-dom";

const TopSellingPage = () => {
  const LIMIT = 20;
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [searchParams] = useSearchParams();
  const range = searchParams.get("range") || "allTime";

  const [trigger] = useLazyGetTopSellingProductsQuery();

  const fetchMore = async () => {
    try {
      const data = await trigger({ range, limit: LIMIT, skip }).unwrap();

      if (!Array.isArray(data)) {
        console.error("Expected array but got:", data);
        setHasMore(false);
        return;
      }

      setProducts((prev) => [...prev, ...data]);
      setSkip((prev) => prev + LIMIT);
      if (data.length < LIMIT) setHasMore(false);
    } catch (err) {
      console.error("Failed to fetch top-selling products", err);
      setHasMore(false);
    }
  };

  useEffect(() => {
    // Reset when range changes
    setProducts([]);
    setSkip(0);
    setHasMore(true);
    fetchMore();
  }, [range]);

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🔥 Top Selling Products ({range})
      </h2>

      <InfiniteScroll
        dataLength={products.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<p className="text-center mt-4 text-gray-500">Loading more...</p>}
        endMessage={<p className="text-center mt-4 text-gray-500">No more products</p>}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              to={`/products/${product.productId}`}
              key={product.productId}
              className="bg-white rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="font-bold text-gray-700">{product.name}</h3>
              <p className="text-sm text-gray-500">
                {product.brand?.name || product.brand || "Unknown"}
              </p>
              <p className="text-green-600 font-semibold">₹{product.price}</p>
              <p className="text-sm text-gray-500 mt-1">Sold: {product.totalSold}</p>
            </Link>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default TopSellingPage;
