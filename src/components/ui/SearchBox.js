// components/ui/SearchBox.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchBox = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="relative flex items-center bg-white rounded-lg border-2 border-gray-300 shadow-sm transition-all duration-300 focus-within:border-gray-600 focus-within:shadow-lg focus-within:-translate-y-0.5">
      <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-600 px-3" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="py-3 pr-10 border-none bg-transparent w-full sm:w-60 focus:outline-none text-gray-900 font-medium"
      />
      {value && (
        <button 
          className="absolute right-2 bg-gray-200 border border-gray-300 text-gray-600 p-1.5 rounded-lg w-7 h-7 flex items-center justify-center transition-all duration-300 hover:bg-gray-300 hover:text-gray-800 hover:scale-105"
          onClick={() => onChange("")}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBox;