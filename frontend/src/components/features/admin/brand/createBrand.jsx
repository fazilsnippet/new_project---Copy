import React, { useState } from "react";
import { useCreateBrandMutation } from "../../../../redux/api/adminApiSlice.js";
import BrandForm from "./BrandForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Simple full-screen loader component
const FullScreenLoader = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="text-white text-lg animate-pulse">Processing...</div>
  </div>
);

const CreateBrand = () => {
  const [createBrand] = useCreateBrandMutation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData) => {
    setLoading(true);
    try {
      await createBrand(formData).unwrap();
      navigate("/admin/brand/getall");
    } catch (err) {
      console.error("Create failed", err);
      toast.error("❌ Error while creating brand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />}
      <BrandForm onSubmit={handleCreate} />
    </>
  );
};

export default CreateBrand;
