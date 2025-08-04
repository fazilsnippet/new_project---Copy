import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetBrandByIdQuery } from "../../../../redux/api/brandApiSlice";

const ViewBrand = ({ inlineBrandId }) => {
  const { brandId: routeBrandId } = useParams(); // from /admin/brand/view/:brandId
  const navigate = useNavigate();

  // Prefer inline prop if available (for reuse), otherwise use route param
  const brandId = inlineBrandId || routeBrandId;

  const {
    data,
    isLoading,
    error,
    isError,
  } = useGetBrandByIdQuery(brandId, { skip: !brandId });

  if (isLoading) {
    return <p className="text-white">Loading brand details...</p>;
  }

  if (isError || error || !data?.brand) {
    return <p className="text-red-500">Brand not found or failed to load</p>;
  }

  const brand = data.brand;

  return (
    <div className="bg-gray-900 text-white p-4 rounded shadow-lg">
      <h2 className="text-xl mb-2">Brand Details</h2>

      <p><strong>Name:</strong> {brand.name}</p>
      <p><strong>Description:</strong> {brand.description}</p>
      <p><strong>Category:</strong> {brand.category?.name || "N/A"}</p>

      {brand.image && (
        <img
          src={brand.image}
          alt={brand.name}
          className="w-32 h-32 object-contain border rounded mt-2"
        />
      )}

      {!inlineBrandId && (
        <button
          onClick={() =>
            navigate(`/admin/brand/update/${brandId}`, {
              state: { brand }, // optional, prefill form if needed
            })
          }
          className="mt-4 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-black"
        >
          Edit Brand
        </button>
      )}
    </div>
  );
};

export default ViewBrand;
