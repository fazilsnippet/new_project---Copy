import React from "react";
export function Checkbox({ id, className, ...props }) {
    return (
      <input
        type="checkbox"
        id={id}
        className={`w-5 h-5 rounded border-gray-300 text-[#3665f3] focus:ring-[#3665f3] ${className}`}
        {...props}
      />
    );
  } 