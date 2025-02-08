import React from "react";

export function Input({ className, ...props }) {
  return (
    <input
      className={`w-full h-12 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3665f3] ${className}`}
      {...props}
    />
  );
}