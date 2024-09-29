import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, Edit, Trash2, Plus } from 'lucide-react';
import { Alert, AlertDescription } from './components/ui/alert';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';

const TaskManagementSystem = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', dueDate: '', priority: 'medium', completed: false });
  const [editingTask, setEditingTask] = useState(null);
  const [sortBy, setSortBy] = useState('dueDate');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.name && newTask.dueDate) {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
      setNewTask({ name: '', dueDate: '', priority: 'medium', completed: false });
    } else {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEditing = (task) => {
    setEditingTask(task);
  };

  const saveEdit = () => {
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
  };

  const sortedAndFilteredTasks = tasks
    .filter(task => filterStatus === 'all' || 
      (filterStatus === 'completed' && task.completed) || 
      (filterStatus === 'active' && !task.completed))
    .sort((a, b) => {
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'completed') return a.completed - b.completed;
      return 0;
    });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Management System</h1>
      
      {showAlert && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please enter both task name and due date.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Task name"
          value={newTask.name}
          onChange={(e) => setNewTask({...newTask, name: e.target.value})}
        />
        <Input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
        />
        <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addTask}><Plus className="mr-2 h-4 w-4" /> Add Task</Button>
      </div>
      
      <div className="flex gap-2 mb-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="completed">Completion Status</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <ul className="space-y-2">
        {sortedAndFilteredTasks.map(task => (
          <li key={task.id} className="flex items-center gap-2 p-2 border rounded">
            {editingTask && editingTask.id === task.id ? (
              <>
                <Input
                  type="text"
                  value={editingTask.name}
                  onChange={(e) => setEditingTask({...editingTask, name: e.target.value})}
                />
                <Input
                  type="date"
                  value={editingTask.dueDate}
                  onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                />
                <Select value={editingTask.priority} onValueChange={(value) => setEditingTask({...editingTask, priority: value})}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={saveEdit}><Check className="h-4 w-4" /></Button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                  className="mr-2"
                />
                <span className={`flex-grow ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.name} - Due: {task.dueDate} - Priority: {task.priority}
                </span>
                <Button variant="outline" size="icon" onClick={() => startEditing(task)}><Edit className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => deleteTask(task.id)}><Trash2 className="h-4 w-4" /></Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManagementSystem;