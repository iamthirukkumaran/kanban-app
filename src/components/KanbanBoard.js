// components/KanbanBoard.js
import React, { useState } from "react";
import Header from "./Header";
import StatsBar from "./StatsBar";
import Column from "./Column";
import TaskModal from "./modals/TaskModal";
import EditTaskModal from "./modals/EditTaskModal";

const KanbanBoard = ({
  tasks,
  searchTerm,
  onSearchChange,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  onClearAllTasks
}) => {
  const columns = ["To Do", "In Progress", "Testing", "Done"];
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const filteredTasks = searchTerm.trim() 
    ? tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : tasks;

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
    <div className="p-5">
      <Header
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onAddTask={() => setShowTaskModal(true)}
        onClearAll={onClearAllTasks}
      />

      <StatsBar columns={columns} taskCounts={getTaskCounts()} />

      <div className="flex flex-col lg:flex-row justify-between gap-4 min-h-[60vh]">
        {columns.map((col) => (
          <Column
            key={col}
            title={col}
            tasks={filteredTasks.filter((t) => t.status === col)}
            allTasks={tasks}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onMoveTask={onMoveTask}
            onEditTask={handleEditTask}
            searchTerm={searchTerm}
          />
        ))}
      </div>

      {showTaskModal && (
        <TaskModal
          onClose={() => setShowTaskModal(false)}
          onSave={onAddTask}
          columns={columns}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={onUpdateTask}
          columns={columns}
        />
      )}
    </div>
  );
};

export default KanbanBoard;