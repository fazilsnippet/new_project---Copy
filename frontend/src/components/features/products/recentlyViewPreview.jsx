import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetRecentlyViewedProductsQuery } from "../../../redux/api/userApiSlice.js";
import ProductPreviewGrid from "../../layout/productGrid.jsx";

const RecentlyViewedPreview = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetRecentlyViewedProductsQuery();
  const [maxItems, setMaxItems] = useState(4);

  useEffect(() => {
    const updateMaxItems = () => {
      setMaxItems(window.innerWidth >= 768 ? 6 : 4);
    };
    updateMaxItems();
    window.addEventListener("resize", updateMaxItems);
    return () => window.removeEventListener("resize", updateMaxItems);
  }, []);

  if (isLoading) return <p className="text-center py-6">Loading recently viewed...</p>;
  if (isError)
    return <p className="text-center text-red-500">Error: {error?.data?.error || error.message}</p>;

  return (
    <ProductPreviewGrid
      title="🕓 Recently Viewed"
      buttonText="View All"
      onButtonClick={() => navigate("/recentlyviewed")}
      products={Array.isArray(data) ? data : []}
      maxItems={maxItems}
    />
  );
};

export default RecentlyViewedPreview;
