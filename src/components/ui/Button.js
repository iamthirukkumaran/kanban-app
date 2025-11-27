// components/ui/Button.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = ({ 
  children, 
  variant = "primary", 
  onClick, 
  icon, 
  type = "button",
  className = "" 
}) => {
  const baseClasses = "px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm border-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-br from-black to-gray-800 text-white border-black hover:from-gray-800 hover:to-gray-700",
    secondary: "bg-white text-gray-700 border-gray-400 hover:bg-gray-100 hover:border-gray-500"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {icon && <FontAwesomeIcon icon={icon} className="text-sm" />}
      {children}
    </button>
  );
};

export default Button;