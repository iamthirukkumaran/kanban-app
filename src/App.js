import React, { useState, useEffect } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
  

const App = () => {
  const columns = ["To Do", "In Progress", "Testing", "Done"];

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("kanbanTasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
    filterTasks();
  }, [tasks, searchTerm]);

  const filterTasks = () => {
    if (!searchTerm.trim()) {
      setFilteredTasks(tasks);
      return;
    }
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  const addTask = (title, description, dueDate, image, status, restrictBackflow = false) => {
    const newTask = {
      id: Date.now(),
      title,
      description,
      dueDate: dueDate || "",
      image,
      status: status || "To Do",
      restrictBackflow: restrictBackflow || false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setShowTaskModal(false);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const moveTask = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const clearAllTasks = () => {
    if (window.confirm("Are you sure you want to clear all tasks? This action cannot be undone.")) {
      setTasks([]);
    }
  };

  const getTaskCounts = () => {
    const counts = {};
    columns.forEach(col => {
      counts[col] = tasks.filter(t => t.status === col).length;
    });
    return counts;
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            
            <h1>Kanban Board</h1>
          </div>
          <div className="header-controls">
            <div className="search-box">
<FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="clear-search" 
                  onClick={() => setSearchTerm("")}
                >
                  ✕
                </button>
              )}
            </div>
            <div className="header-actions">
              <button className="primary-btn" onClick={() => setShowTaskModal(true)}>
                <span className="btn-icon">+</span>
                New Task
              </button>
              <button className="secondary-btn" onClick={clearAllTasks}>
                Clear All
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="stats-bar">
        {columns.map(col => (
          <div key={col} className="stat-item">
            <div className="stat-content">
              <span className="stat-count">{getTaskCounts()[col]}</span>
              <span className="stat-label">{col}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="board">
        {columns.map((col) => (
          <Column
            key={col}
            title={col}
            tasks={filteredTasks.filter((t) => t.status === col)}
            allTasks={tasks}
            updateTask={updateTask}
            deleteTask={deleteTask}
            moveTask={moveTask}
            searchTerm={searchTerm}
            onEditTask={handleEditTask}
          />
        ))}
      </div>

      {showTaskModal && (
        <TaskModal
          onClose={() => setShowTaskModal(false)}
          onSave={addTask}
          columns={columns}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={updateTask}
          columns={columns}
        />
      )}
    </div>
  );
};

const TaskModal = ({ onClose, onSave, columns }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    image: "",
    status: "To Do",
    restrictBackflow: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      alert("Title and Description are required!");
      return;
    }
    const imageFile = form.image ? URL.createObjectURL(form.image) : "";
    onSave(form.title, form.description, form.dueDate, imageFile, form.status, form.restrictBackflow);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Task</h2>
          <button className="close-btn" onClick={onClose}>
            <span>✕</span>
          </button>
        </div>
        
        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              placeholder="Enter task title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              placeholder="Enter task description..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Attachment</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              />
              <span className="file-input-label">Choose file</span>
            </div>
          </div>
 <div className="form-group checkbox-group">
  <label className="checkbox-label">
    <input
      type="checkbox"
      checked={form.restrictBackflow}
      onChange={(e) =>
        setForm({ ...form, restrictBackflow: e.target.checked })
      }
    />
    <span className="custom-checkbox"></span>
    <span className="checkbox-text">Restrict Backflow</span>
  </label>

  <small>Prevent moving this task to previous columns</small>
</div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Task
            </button>
          </div>
        </form>
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
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setForm({ ...form, image: imageUrl });
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Task</h2>
          <button className="close-btn" onClick={onClose}>
            <span>✕</span>
          </button>
        </div>
        
        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              placeholder="Enter task title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              placeholder="Enter task description..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Attachment</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <span className="file-input-label">Choose file</span>
            </div>
            {form.image && (
              <div className="current-image">
                <p>Current Image:</p>
                <img src={form.image} alt="Current task" className="task-preview-image" />
              </div>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.restrictBackflow}
                onChange={(e) =>
                  setForm({ ...form, restrictBackflow: e.target.checked })
                }
              />
              <span className="custom-checkbox"></span>
              Restrict Backflow
            </label>
            <small>Prevent moving this task to previous columns</small>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Column = ({
  title,
  tasks,
  updateTask,
  deleteTask,
  moveTask,
  allTasks,
  searchTerm,
  onEditTask
}) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData("id"));
    const task = allTasks.find((t) => t.id === id);

    if (!task) return;

    const order = ["To Do", "In Progress", "Testing", "Done"];
    const fromIndex = order.indexOf(task.status);
    const toIndex = order.indexOf(title);

    if (task.restrictBackflow && toIndex < fromIndex) {
      alert("Backflow is restricted for this task.");
      return;
    }

    if (task.status === "To Do" && title === "In Progress" && !task.dueDate) {
      alert("Due date is required before moving to In Progress.");
      return;
    }

    moveTask(id, title);
  };

  const getColumnIcon = () => {
    const icons = {
      "To Do": "",
      "In Progress": "", 
      "Testing": "",
      "Done": ""
    };
    return icons[title];
  };

  return (
    <div
      className="column"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <div className="column-title">
          <span className="column-icon">{getColumnIcon()}</span>
          <h2>{title}</h2>
        </div>
        <span className="task-count">{tasks.length}</span>
      </div>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>{searchTerm ? "No matching tasks" : "No tasks yet"}</p>
            {!searchTerm && title === "To Do" && (
              <p className="empty-hint">Create your first task to get started</p>
            )}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              onEditTask={onEditTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

const TaskCard = ({ task, deleteTask, onEditTask }) => {
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

  const handleCardHover = (hovering) => {
    setShowActions(hovering);
  };

  return (
    <div 
      className={`task-card ${isOverdue() ? 'overdue' : ''} ${isExpanded ? 'expanded' : ''}`} 
      draggable 
      onDragStart={handleDragStart}
      onMouseEnter={() => handleCardHover(true)}
      onMouseLeave={() => handleCardHover(false)}
    >
      {/* Header Section with Actions Only */}
      <div className="task-header">
        <div className="header-left">
          <h3>{task.title}</h3>
        </div>
        <div className="header-right">
          <div className={`task-actions ${showActions ? 'visible' : ''}`}>
            <button onClick={() => onEditTask(task)} className="edit-btn" title="Edit task">
              <span className="action-icon">✏️</span>
            </button>
            <button onClick={() => deleteTask(task.id)} className="delete-btn" title="Delete task">
              <span className="action-icon">🗑️</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="task-card-content">
        <p className="task-description">{task.description}</p>
        
        {task.dueDate && (
          <div className={`due-date ${isOverdue() ? 'overdue' : ''}`}>
            <span className="date-icon">📅</span>
            <span className="date-text">{formatDate(task.dueDate)}</span>
            {isOverdue() && <span className="overdue-indicator">Overdue</span>}
          </div>
        )}
        
        {isExpanded && task.image && (
          <div className="task-image-container">
            <img src={task.image} alt="task" className="task-image" />
          </div>
        )}
        
        {isExpanded && (
          <div className="task-meta">
            <div className="meta-item">
              <span className="meta-icon">🔒</span>
              <span className="meta-text">Backflow: {task.restrictBackflow ? "Restricted" : "Allowed"}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">🕒</span>
              <span className="meta-text">Created: {formatDate(task.createdAt)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Expand Toggle */}
      {(task.image || task.description.length > 100) && (
        <button 
          className="task-expand-toggle"
          onClick={toggleExpand}
          title={isExpanded ? "Collapse" : "Expand"}
        >
          <span className="expand-icon">{isExpanded ? '▲' : '▼'}</span>
        </button>
      )}
    </div>
  );
};

export default App;
