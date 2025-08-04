import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetCategoryByIdQuery } from '../../redux/api/categoryApiSlice.js'

const CategoryProducts = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isFetching, isError } = useGetCategoryByIdQuery(
    { id, page, limit },
    { keepPreviousData: true }
  );

  const [allProducts, setAllProducts] = useState([]);
  const observerRef = useRef(null);

  const category = data?.category;
  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    if (!products || products.length === 0) return;

    setAllProducts((prev) => {
      const existingIds = new Set(prev.map((p) => p._id));
      const newProducts = products.filter((p) => !existingIds.has(p._id));
      return page === 1 ? products : [...prev, ...newProducts];
    });
  }, [products, page]);

  const lastProductRef = useCallback(
    (node) => {
      if (isFetching) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetching, page, totalPages]
  );

  return (
    <section className="p-4 max-w-6xl mx-auto">
      {isLoading && page === 1 && <p className="text-gray-500">Loading category...</p>}
      {isError && <p className="text-red-500">Error fetching category.</p>}

      {category && (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{category.name}</h2>
          <p className="text-gray-600 mb-6">{category.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allProducts.map((product, index) => {
              const isLast = index === allProducts.length - 1;
              return (
                <Link
                  to={`/products/${product._id}`}
                  key={product._id}
                  ref={isLast ? lastProductRef : null}
                  className="border rounded shadow p-2 bg-white hover:shadow-md transition block"
                >
                  <img
                    src={product.images?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-40 object-contain mb-2"
                  />
                  <h3 className="text-sm font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.price} ₹</p>
                </Link>
              );
            })}
          </div>

          {isFetching && page > 1 && (
            <p className="text-center text-sm mt-4 text-gray-400">Loading more...</p>
          )}
        </>
      )}
    </section>
  );
};

export default CategoryProducts;
