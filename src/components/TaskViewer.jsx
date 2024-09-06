import React, { useState, useEffect, useCallback } from 'react';

const TaskViewer = ({ tasks, selectedDate }) => {
  const [viewType, setViewType] = useState('monthly');
  const [filteredTasks, setFilteredTasks] = useState([]);

  const filterTasks = useCallback(() => {
    const today = new Date(selectedDate); // Adjust this if the dates are not correct
    let filtered = [];
    switch (viewType) {
      case 'daily':
        filtered = tasks.filter(t => new Date(t.date).toDateString() === today.toDateString());
        break;
      case 'weekly':
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
        filtered = tasks.filter(t => {
          const taskDate = new Date(t.date);
          return taskDate >= startOfWeek && taskDate <= endOfWeek;
        });
        break;
      case 'monthly':
        filtered = tasks.filter(t => {
          const taskDate = new Date(t.date);
          return taskDate.getMonth() === today.getMonth() && taskDate.getFullYear() === today.getFullYear();
        });
        break;
      case 'yearly':
        filtered = tasks.filter(t => new Date(t.date).getFullYear() === today.getFullYear());
        break;
    }
    setFilteredTasks(filtered);
  }, [tasks, viewType, selectedDate]);

  useEffect(() => {
    filterTasks();
  }, [filterTasks]);

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(type => (
          <button key={type} onClick={() => setViewType(type.toLowerCase())} className="bg-blue-500 text-white py-2 px-4 rounded text-sm w-full flex justify-center items-center" title={type}>
            {type}
          </button>
        ))}
      </div>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-left">Date</th>
            <th className="border border-gray-300 p-2 text-left">Task</th>
            <th className="border border-gray-300 p-2 text-left">Recurrence</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? filteredTasks.map((task, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{new Date(task.date).toLocaleDateString()}</td>
              <td className="border border-gray-300 p-2">{task.task}</td>
              <td className="border border-gray-300 p-2">{task.recurrence}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="3" className="border border-gray-300 p-2 text-center">No tasks found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskViewer;
