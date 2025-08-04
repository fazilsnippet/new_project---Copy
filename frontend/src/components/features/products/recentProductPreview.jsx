import React, { useEffect } from "react";
import { useLazyGetRecentProductsQuery } from "../../../redux/api/productApiSlice";
import ProductPreviewGrid from "../../layout/productGrid";
import { useNavigate } from "react-router-dom";

export const RecentProductPreview = () => {
  const navigate = useNavigate();

  // Destructure: trigger function and result object
  const [trigger, { data, isLoading, isError, error }] = useLazyGetRecentProductsQuery();

  // Automatically trigger API call on component mount
  useEffect(() => {
    trigger({ limit: 6 });
  }, [trigger]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.data?.error || error.message}</p>;

  return (
    <ProductPreviewGrid
      title="🆕 Recently Added"
      products={data || []}
      maxItems={6}
      buttonText="See All"
      onButtonClick={() => navigate("/products/recent")}
    />
  );
};
