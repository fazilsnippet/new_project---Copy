import React, { useState } from "react";
import {
  useGetAllBrandsQuery,
} from "../../../../redux/api/brandApiSlice";
import { useDeleteBrandMutation } from "../../../../redux/api/adminApiSlice";
import { Link } from "react-router-dom";
import ViewBrand from "./viewBrand";

const BrandList = () => {
  const { data, isLoading } = useGetAllBrandsQuery();
  const [deleteBrand] = useDeleteBrandMutation();
  const [viewBrandId, setViewBrandId] = useState(null);

  const handleDelete = async (brandId) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      await deleteBrand(brandId);
    }
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">All Brands</h1>
        <Link
          to="/admin/brand/create"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Add Brand
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row">
          {/* Brand List Scrollable */}
          <div className={`w-full md:w-2/3 ${viewBrandId ? 'md:pr-4' : ''} h-[80vh] overflow-y-auto border-gray-700`}>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="border-b py-2">Image</th>
                  <th className="border-b py-2">Name</th>
                  <th className="border-b py-2">Category</th>
                  <th className="border-b py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.brands?.map((brand) => (
                  <tr key={brand._id} className="border-b border-gray-700">
                    <td className="py-2">
                      <img
                        src={brand.image}
                        alt={brand.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="py-2">{brand.name}</td>
                    <td className="py-2">{brand.category?.name || "N/A"}</td>
                    <td className="py-2">
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        <Link
                          to={`/admin/brand/update/${brand._id}`}
                          state={{ brand }}
                          className="bg-blue-600 px-3 py-1 rounded text-white"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() =>
                            setViewBrandId((prev) =>
                              prev === brand._id ? null : brand._id
                            )
                          }
                          className="bg-gray-600 px-3 py-1 rounded text-white"
                        >
                          {viewBrandId === brand._id ? "Hide" : "View"}
                        </button>
                        <button
                          onClick={() => handleDelete(brand._id)}
                          className="text-red-500 hover:underline px-2"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View Panel only shown if needed */}
          {viewBrandId && (
            <div className="md:w-1/3">
              <div className="fixed bottom-0 left-0 w-full md:top-0 md:bottom-0 md:left-auto md:right-0 md:w-[400px] md:h-full md:overflow-y-auto bg-zinc-900 border-t md:border-l md:border-t-0 border-gray-700 z-50 shadow-lg">
                <ViewBrand inlineBrandId={viewBrandId} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandList;
