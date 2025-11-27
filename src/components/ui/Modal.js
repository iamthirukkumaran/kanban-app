// components/ui/Modal.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 backdrop-blur-sm" 
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-xl border-2 border-gray-400 animate-modalSlideIn">
        <div className="flex justify-between items-center p-6 border-b border-gray-300 bg-white rounded-t-2xl">
          <h2 className="text-xl font-semibold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {title}
          </h2>
          <button 
            className="bg-gray-100 border border-gray-300 text-gray-600 p-2 rounded-xl w-9 h-9 flex items-center justify-center transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 hover:rotate-90 hover:scale-105 font-bold"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;