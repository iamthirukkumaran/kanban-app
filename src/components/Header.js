// components/Header.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";

const Header = ({ searchTerm, onSearchChange, onAddTask, onClearAll }) => {
  return (
    <header className="bg-white rounded-xl shadow-md border border-gray-200 p-2 mb-2 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-800 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-md border border-gray-700">
            K
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Kanban Board
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto h-10 mt-1">
          <div className="relative flex items-center bg-white rounded-lg border-2 border-gray-300 shadow-sm transition-all duration-300 focus-within:border-gray-600 focus-within:shadow-lg focus-within:-translate-y-0.5">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-600 px-3" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="py-3 pr-10 h-10 mt-2 border-none bg-transparent w-full sm:w-60 focus:outline-none text-gray-900 font-medium"
            />
            {searchTerm && (
              <button 
                className=" absolute right-2 bg-gray-200 border border-gray-300 h-10 mt-2 text-gray-600 p-1.5 rounded-lg w-7 h-7 flex items-center justify-center transition-all duration-300 hover:bg-gray-300 hover:text-gray-800 hover:scale-105"
                onClick={() => onSearchChange("")}
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button 
              className="bg-gradient-to-br from-black to-gray-800 text-white h-10 mb-2 px-1 py-0.5 rounded-lg font-semibold flex items-center gap-1 shadow-sm border border-black transition-all duration-300 hover:from-gray-800 hover:to-gray-700 hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden"
              onClick={onAddTask}
            >
              <FontAwesomeIcon icon={faPlus} className="text-sm" />
              New Task
            </button>
            <button 
              className="bg-white text-gray-700 px-2 py-0.5 h-10 mb-2 rounded-lg font-semibold flex items-center gap-1 shadow-sm border border-gray-400 transition-all duration-300 hover:bg-gray-100 hover:border-gray-500 hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden"
              onClick={onClearAll}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;