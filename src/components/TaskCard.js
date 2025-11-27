// src/components/TaskCard.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faCalendar, faLock, faClock } from "@fortawesome/free-solid-svg-icons";

function ActionButton({ icon, onClick, title, variant }) {
  return (
    <button 
      onClick={onClick} 
      className={`w-7 h-7 p-0 bg-white text-gray-700 rounded-lg border-2 border-gray-400 shadow-sm transition-all duration-300 hover:bg-gray-100 hover:border-gray-500 hover:scale-105 hover:shadow-md flex items-center justify-center relative overflow-hidden ${
        variant === 'edit' ? 'hover:rotate-3' : 'hover:-rotate-3'
      }`}
      title={title}
    >
      <FontAwesomeIcon icon={icon} className="text-xs" />
    </button>
  );
}

function DueDate({ date, isOverdue, formattedDate }) {
  return (
    <div className={`flex items-center gap-2 px-2.5 py-2 bg-gray-50 rounded-lg border-2 border-gray-300 transition-all duration-300 hover:bg-gray-100 hover:translate-x-0.5 text-xs font-medium ${
      isOverdue ? 'bg-gray-100 border-gray-400 border-2 animate-pulse' : ''
    }`}>
      <FontAwesomeIcon icon={faCalendar} className="text-gray-700 text-xs" />
      <span className="flex-1 text-gray-700">{formattedDate}</span>
      {isOverdue && (
        <span className="px-2 py-1 bg-gray-300 rounded-2xl text-xs font-semibold text-gray-800 border border-gray-400 animate-blink">
          Overdue
        </span>
      )}
    </div>
  );
}

function TaskImage({ image }) {
  return (
    <div className="mt-2.5 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
      <img src={image} alt="task" className="w-full h-24 object-cover transition-transform duration-300 hover:scale-105" />
    </div>
  );
}

function TaskMeta({ restrictBackflow, createdAt, formatDate }) {
  return (
    <div className="flex flex-col gap-2 mt-2.5">
      <div className="flex items-center gap-2 text-xs text-gray-600 px-2 py-1.5 bg-gray-50 rounded border border-gray-200 transition-all duration-300 hover:bg-gray-100 hover:translate-x-0.5 font-medium">
        <FontAwesomeIcon icon={faLock} className="text-xs opacity-80" />
        <span className="flex-1">Backflow: {restrictBackflow ? "Restricted" : "Allowed"}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-600 px-2 py-1.5 bg-gray-50 rounded border border-gray-200 transition-all duration-300 hover:bg-gray-100 hover:translate-x-0.5 font-medium">
        <FontAwesomeIcon icon={faClock} className="text-xs opacity-80" />
        <span className="flex-1">Created: {formatDate(createdAt)}</span>
      </div>
    </div>
  );
}

function TaskCard({ task, onDelete, onEdit }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  const handleDragStart = (e) => {
    e.dataTransfer.setData("id", task.id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = () => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && task.status !== "Done";
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`bg-white rounded-xl p-4 cursor-grab shadow-sm border-2 border-gray-300 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg hover:border-gray-400 relative overflow-hidden backdrop-blur-sm ${
        isOverdue() ? 'border-l-4 border-l-gray-600 bg-gradient-to-br from-gray-50 to-white' : ''
      } ${isExpanded ? 'expanded' : ''}`}
      draggable 
      onDragStart={handleDragStart}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 rounded-t-xl"></div>
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-3 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">{task.title}</h3>
        </div>
        <div className={`flex gap-1.5 transition-all duration-300 ${showActions ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <ActionButton
            icon={faEdit}
            onClick={() => onEdit(task)}
            title="Edit task"
            variant="edit"
          />
          <ActionButton
            icon={faTrash}
            onClick={() => onDelete(task.id)}
            title="Delete task"
            variant="delete"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-2.5">
        <p className={`text-gray-600 m-0 text-sm leading-relaxed font-medium ${
          isExpanded ? '' : 'line-clamp-2'
        }`}>
          {task.description}
        </p>
        
        {task.dueDate && (
          <DueDate 
            date={task.dueDate} 
            isOverdue={isOverdue()} 
            formattedDate={formatDate(task.dueDate)}
          />
        )}
        
        {/* Image - Always show when available */}
        {task.image && (
          <TaskImage image={task.image} />
        )}
        
        {isExpanded && (
          <TaskMeta 
            restrictBackflow={task.restrictBackflow}
            createdAt={task.createdAt}
            formatDate={formatDate}
          />
        )}
      </div>

      {/* Expand Toggle - Only show for tasks with images or long descriptions */}
      {(task.image || task.description.length > 100) && (
        <button 
          className={`absolute bottom-2 right-2 w-6 h-6 border-none rounded-lg bg-gray-200 text-gray-600 cursor-pointer flex items-center justify-center text-xs transition-all duration-300 border border-gray-300 hover:bg-gray-300 hover:scale-105 ${
            showActions ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={toggleExpand}
          title={isExpanded ? "Collapse" : "Expand"}
        >
          <span className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      )}
    </div>
  );
}

export default TaskCard;