import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Task, ViewMode } from '../types';

const API = 'https://calapi-production.up.railway.app';

interface TaskContextValue {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  addTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/tasks`);
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err: any) {
      setError('Could not connect to the API. Is the backend running on port 4000?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tasks when the app first mounts
  useEffect(() => {
  fetchTasks();
  const interval = setInterval(fetchTasks, 10000); // re-fetch every 10 seconds
  return () => clearInterval(interval);
}, [fetchTasks]);

  const addTask = useCallback(async (task: Task) => {
    const res = await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error(await res.text());
    const saved: Task = await res.json();
    setTasks(prev => [...prev, saved]);
  }, []);

  const updateTask = useCallback(async (task: Task) => {
    const res = await fetch(`${API}/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error(await res.text());
    const updated: Task = await res.json();
    setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    const res = await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <TaskContext.Provider value={{
      tasks, loading, error, viewMode, setViewMode,
      addTask, updateTask, deleteTask, refetch: fetchTasks,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used inside TaskProvider');
  return ctx;
}
