import React from "react";
import { useLocation } from "react-router-dom";
import UpdateBrand from "./UpdateBrand";

const UpdateBrandWrapper = () => {
  const location = useLocation();
  const brand = location.state?.brand || null;

  return <UpdateBrand initialData={brand} />;
};

export default UpdateBrandWrapper;
