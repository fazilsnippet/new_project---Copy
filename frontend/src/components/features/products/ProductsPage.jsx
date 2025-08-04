

// import React, { useEffect, useState } from "react";
// import { useGetAllProductsQuery } from "../../../redux/api/productApiSlice";
// import { useInView } from "react-intersection-observer";
// import Header from "../../layout/header";
// import ProductGridTemplate from "../../layout/allproductGrid";

// const ProductListPage = () => {
//   const [page, setPage] = useState(1);
//   const [items, setItems] = useState([]);

//   const {
//     data,
//     isLoading,
//     isFetching,
//     isError,
//   } = useGetAllProductsQuery({ filters: { page, limit: 10 } });

//   const { ref, inView } = useInView();

//   useEffect(() => {
//     if (data?.products) {
//       setItems((prevItems) => {
//         const newItems = data.products.filter(
//           (p) => !prevItems.some((existing) => existing._id === p._id)
//         );
//         return [...prevItems, ...newItems];
//       });
//     }
//   }, [data]);

//   useEffect(() => {
//     if (inView && !isFetching && data?.currentPage < data?.totalPages) {
//       setPage((prev) => prev + 1);
//     }
//   }, [inView, isFetching, data?.currentPage, data?.totalPages]);

//   useEffect(() => {
//     return () => setItems([]);
//   }, []);

//   if (isError) {
//     return (
//       <div className="text-center py-10 text-red-500">Failed to load products.</div>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <ProductGridTemplate
//         items={items}
//         totalCount={data?.totalCount}
//         currentPage={data?.currentPage}
//         totalPages={data?.totalPages}
//         inViewRef={ref}
//         isFetching={isFetching}
//         title="All Products"
//         subtitle="Browse our entire product range"
//       />
//     </>
//   );
// };

// export default ProductListPage;

import React, { useEffect, useState } from "react";
import { useGetAllProductsQuery } from "../../../redux/api/productApiSlice";
import Header from "../../layout/header";
import ProductGridTemplate from "../../layout/allproductGrid";
import InfiniteScrollWrapper from "../../ui/infiniteScrolling";

const ProductListPage = () => {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);

  const { data, isFetching, isError } = useGetAllProductsQuery({
    page,
    limit: 12,
  });

  // Append products without duplicates
  useEffect(() => {
    if (data?.products) {
      setAllProducts((prev) => {
        const newProducts = data.products.filter(
          (p) => !prev.some((existing) => existing._id === p._id)
        );
        return [...prev, ...newProducts];
      });
    }
  }, [data]);

  const loadMoreProducts = () => {
    if (
      data?.pagination?.currentPage < data?.pagination?.totalPages &&
      !isFetching
    ) {
      setPage((prev) => prev + 1);
    }
  };

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load products.
      </div>
    );
  }

  return (
    <>
      <Header />
      <InfiniteScrollWrapper
        loadMore={loadMoreProducts}
        hasMore={data?.pagination?.currentPage < data?.pagination?.totalPages}
        isLoading={isFetching}
      >
        <ProductGridTemplate
          items={allProducts}
          totalCount={data?.pagination?.totalCount}
          currentPage={data?.pagination?.currentPage || 1}
          totalPages={data?.pagination?.totalPages || 1}
          title="All Products"
          subtitle="Browse our entire product range"
        />
      </InfiniteScrollWrapper>
    </>
  );
};

export default ProductListPage;
