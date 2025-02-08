// Button Component
import React from "react";

export function Button({ children, className, variant = "default", ...props }) {
  const baseStyles = "px-4 py-2 rounded-full font-medium transition-all";
  const variants = {
    default: "bg-[#3665f3] text-white hover:bg-[#2b4ec2]",
    outline: "border border-gray-300 text-black hover:bg-gray-100",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
