// components/Column.js
import React from "react";
import TaskCard from "./TaskCard";

const EmptyState = ({ searchTerm, title }) => (
  <div className="text-center text-gray-500 py-10 px-4 italic text-sm bg-gray-50 rounded-xl border-2 border-dashed border-gray-400 transition-all duration-300 hover:border-gray-500 hover:bg-gray-100 hover:-translate-y-0.5 font-medium">
    <div className="text-4xl mb-3 opacity-60 transition-transform duration-300 hover:scale-105">📭</div>
    <p>{searchTerm ? "No matching tasks" : "No tasks yet"}</p>
    {!searchTerm && title === "To Do" && (
      <p className="text-gray-400 text-xs mt-1.5 font-normal">Create your first task to get started</p>
    )}
  </div>
);

const Column = ({
  title,
  tasks,
  allTasks,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  onEditTask,
  searchTerm
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

    onMoveTask(id, title);
  };

  return (
    <div
      className="bg-white rounded-xl p-5 flex-1 min-h-[500px] h-auto shadow-md border-2 border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gray-300 backdrop-blur-sm flex flex-col relative overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 rounded-t-xl"></div>
      
      <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wider">{title}</h2>
        </div>
        <span className="bg-gray-100 px-3 py-1.5 rounded-2xl font-semibold text-gray-700 text-xs border-2 border-gray-300 shadow-sm">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1.5">
        {tasks.length === 0 ? (
          <EmptyState searchTerm={searchTerm} title={title} />
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Column;