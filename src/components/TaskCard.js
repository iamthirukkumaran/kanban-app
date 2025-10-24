import React, { useState } from "react";

const TaskCard = ({ task, updateTask, deleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState(task);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("id", task.id);
  };

  const handleSave = () => {
    updateTask(edit);
    setIsEditing(false);
  };

  return (
    <div className="task-card" draggable onDragStart={handleDragStart}>
      {isEditing ? (
        <>
          <input
            value={edit.title}
            onChange={(e) => setEdit({ ...edit, title: e.target.value })}
          />
          <textarea
            value={edit.description}
            onChange={(e) => setEdit({ ...edit, description: e.target.value })}
          />
          <input
            type="date"
            value={edit.dueDate}
            onChange={(e) => setEdit({ ...edit, dueDate: e.target.value })}
          />
          <label>
            Restrict Backflow:
            <input
              type="checkbox"
              checked={edit.restrictBackflow}
              onChange={(e) =>
                setEdit({ ...edit, restrictBackflow: e.target.checked })
              }
            />
          </label>
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          {task.dueDate && <p>📅 {task.dueDate}</p>}
          {task.image && (
            <img src={task.image} alt="task" className="task-image" />
          )}
          <p>
            Restrict Backflow: {task.restrictBackflow ? "Yes" : "No"}
          </p>
          <div className="task-actions">
            <button onClick={() => setIsEditing(true)}>✏️ Edit</button>
            <button onClick={() => deleteTask(task.id)}>🗑️ Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
