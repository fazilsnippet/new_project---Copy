// src/pages/admin/brand/UpdateBrand.jsx
import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useUpdateBrandMutation } from "../../../../redux/api/adminApiSlice.js";
import BrandForm from "./BrandForm";
import { toast } from "react-toastify";

const UpdateBrand = ({ initialData }) => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const [updateBrand, { isLoading }] = useUpdateBrandMutation();

  const handleUpdate = async (formData) => {
    try {
      await updateBrand({ brandId, body: formData }).unwrap();
      toast.success("Brand updated successfully!");
      navigate("/admin/brand/getall");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update brand");
    }
  };

  if (!initialData) return <p className="text-red-500">Invalid or missing data</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <BrandForm onSubmit={handleUpdate} initialData={initialData} isLoading={isLoading} />
    </div>
  );
};

export default UpdateBrand;
