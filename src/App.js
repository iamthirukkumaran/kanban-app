// App.js
import React, { useState, useEffect } from "react";
import KanbanBoard from "./components/KanbanBoard";

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("kanbanTasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }, [tasks]);

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
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-['Poppins'] text-gray-900">
      <KanbanBoard
        tasks={tasks}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddTask={addTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        onMoveTask={moveTask}
        onClearAllTasks={clearAllTasks}
      />
    </div>
  );
};

export default App;