import React, { useState } from "react";
import TaskCard from "./TaskCard";

const Column = ({
  title,
  tasks,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  allTasks,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    image: "",
  });

  const handleDrop = (e) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData("id"));
    const task = allTasks.find((t) => t.id === id);

    if (!task) return;

    // Restrict Backflow check
    const order = ["To Do", "In Progress", "Testing", "Done"];
    const fromIndex = order.indexOf(task.status);
    const toIndex = order.indexOf(title);

    if (task.restrictBackflow && toIndex < fromIndex) {
      alert("Backflow is restricted for this task.");
      return;
    }

    // Due date check when moving To Do -> In Progress
    if (task.status === "To Do" && title === "In Progress" && !task.dueDate) {
      alert("Due date is required before moving to In Progress.");
      return;
    }

    moveTask(id, title);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      alert("Title and Description are mandatory!");
      return;
    }
    const imageFile = form.image ? URL.createObjectURL(form.image) : "";
    addTask(form.title, form.description, form.dueDate, imageFile);
    setForm({ title: "", description: "", dueDate: "", image: "" });
    setShowForm(false);
  };

  return (
    <div
      className="column"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <h2>{title}</h2>

      {title === "To Do" && (
        <button onClick={() => setShowForm(!showForm)}>+ Add Task</button>
      )}

      {showForm && (
        <form className="task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          <input
            type="file"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />
          <button type="submit">Add</button>
        </form>
      )}

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
};

export default Column;
