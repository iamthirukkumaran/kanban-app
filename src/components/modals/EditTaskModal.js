// components/modals/EditTaskModal.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const FormField = ({ label, type, value, onChange, options, required, ...props }) => (
  <div className="mb-5">
    <label className="block mb-2 font-semibold text-gray-800 text-sm">{label}</label>
    {type === "textarea" ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl text-sm font-medium text-gray-900 transition-all duration-300 focus:border-gray-600 focus:shadow-md focus:-translate-y-0.5 focus:outline-none resize-vertical min-h-[80px] leading-relaxed"
        required={required}
        {...props}
      />
    ) : type === "select" ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl text-sm font-medium text-gray-900 transition-all duration-300 focus:border-gray-600 focus:shadow-md focus:-translate-y-0.5 focus:outline-none"
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl text-sm font-medium text-gray-900 transition-all duration-300 focus:border-gray-600 focus:shadow-md focus:-translate-y-0.5 focus:outline-none"
        required={required}
        {...props}
      />
    )}
  </div>
);

const FileInput = ({ onChange, currentImage }) => (
  <div className="mb-5">
    <label className="block mb-2 font-semibold text-gray-800 text-sm">Attachment</label>
    <div className="relative inline-block w-full">
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <span className="block px-4 py-3 bg-gray-50 border-2 border-gray-400 rounded-xl text-center text-sm text-gray-600 cursor-pointer transition-all duration-300 hover:bg-gray-100 hover:border-gray-500 hover:-translate-y-0.5 hover:shadow-sm font-medium">
        Choose file
      </span>
    </div>
    {currentImage && (
      <div className="mt-3 p-3 bg-gray-50 rounded-lg border-2 border-gray-300">
        <p className="mb-2 font-semibold text-gray-700 text-xs">Current Image:</p>
        <img src={currentImage} alt="Current task" className="w-full max-h-32 object-cover rounded-lg border-2 border-gray-300 shadow-md" />
      </div>
    )}
  </div>
);

const CheckboxField = ({ label, checked, onChange, description }) => (
  <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-300 transition-all duration-300 hover:border-gray-400 hover:bg-gray-100 hover:-translate-y-0.5 mb-5">
    <label className="flex items-center gap-3 text-sm font-semibold text-gray-800 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
      <span className={`w-4 h-4 border-2 border-gray-500 rounded flex items-center justify-center transition-all duration-250 ${
        checked ? 'bg-black border-black scale-105 shadow-sm' : 'bg-white'
      }`}>
        {checked && <span className="text-white text-xs font-bold">✓</span>}
      </span>
      {label}
    </label>
    <small className="text-gray-600 text-xs ml-7 block leading-relaxed font-medium">
      {description}
    </small>
  </div>
);

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

const EditTaskModal = ({ task, onClose, onSave, columns }) => {
  const [form, setForm] = useState({
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    image: task.image,
    status: task.status,
    restrictBackflow: task.restrictBackflow,
    createdAt: task.createdAt
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      alert("Title and Description are required!");
      return;
    }
    onSave(form);
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setForm({ ...form, image: imageUrl });
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Task">
      <form className="p-6" onSubmit={handleSubmit}>
        <FormField
          label="Task Title *"
          type="text"
          placeholder="Enter task title..."
          value={form.title}
          onChange={(value) => setForm({ ...form, title: value })}
          required
        />

        <FormField
          label="Description *"
          type="textarea"
          placeholder="Enter task description..."
          value={form.description}
          onChange={(value) => setForm({ ...form, description: value })}
          rows="4"
          required
        />

        <div className="flex gap-3 mb-5">
          <FormField
            label="Status"
            type="select"
            value={form.status}
            onChange={(value) => setForm({ ...form, status: value })}
            options={columns}
          />

          <FormField
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={(value) => setForm({ ...form, dueDate: value })}
          />
        </div>

        <FileInput
          onChange={handleImageChange}
          currentImage={form.image}
        />

        <CheckboxField
          label="Restrict Backflow"
          checked={form.restrictBackflow}
          onChange={(checked) => setForm({ ...form, restrictBackflow: checked })}
          description="Prevent moving this task to previous columns"
        />

        <div className="flex gap-3 mt-5 pt-4 border-t border-gray-300">
          <button 
            type="button" 
            className="flex-1 bg-white text-gray-700 px-5 py-3 rounded-xl font-semibold border-2 border-gray-400 shadow-sm transition-all duration-300 hover:bg-gray-100 hover:border-gray-500 hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="flex-1 bg-gradient-to-br from-black to-gray-800 text-white px-5 py-3 rounded-xl font-semibold border-2 border-black shadow-sm transition-all duration-300 hover:from-gray-800 hover:to-gray-700 hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;