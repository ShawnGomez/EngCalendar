import React, { useState, useEffect } from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import CalendarView from './components/CalendarView';
import ListView from './components/ListView';
import TaskModal from './components/TaskModal';
import './App.css';

function AppInner() {
  const { viewMode, setViewMode, tasks, loading, error, refetch } = useTasks();
  const [modalOpen, setModalOpen]     = useState(false);
  const [editTaskId, setEditTaskId]   = useState<string | null>(null);
  const [prefillDate, setPrefillDate] = useState<string | null>(null);
  const [darkMode,  setDarkMode]      = useState(true); 
  const now = new Date();
  const [calYear, setCalYear]   = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());


  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  function openNew(date?: string) {
    setEditTaskId(null);
    setPrefillDate(date ?? null);
    setModalOpen(true);
  }

  function openEdit(taskId: string) {
    setEditTaskId(taskId);
    setPrefillDate(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTaskId(null);
    setPrefillDate(null);
  }

  const overdueCount = tasks.filter(t => {
    const [y, m, d] = t.dueDate.split('-').map(Number);
    const due = new Date(y, m - 1, d, 23, 59, 59);
    return due.getTime() < Date.now();
  }).length;

  return (
      <div className="app">
  <header className="app-header">
    <div className="header-left">
      <span className="logo-text">Calendar</span>
      <button
        className="dark-mode-btn"
        onClick={() => setDarkMode(d => !d)}
        title="Toggle dark mode"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
    <div className="header-center">
      <div className="view-toggle">
        <button
          className={`toggle-btn${viewMode === 'list' ? ' active' : ''}`}
          onClick={() => setViewMode('list')}
        >
          List
        </button>
        <button
          className={`toggle-btn${viewMode === 'calendar' ? ' active' : ''}`}
          onClick={() => setViewMode('calendar')}
        >
          Calendar
        </button>
      </div>
    </div>
    <div className="header-right">
      <button className="refresh-btn" onClick={refetch} title="Refresh">↻</button>
      <button className="add-task-btn" onClick={() => openNew()}>+ Add Task</button>
    </div>
  </header>

      {error && (
        <div className="error-banner">
          ⚠️ {error}
          <button onClick={refetch}>Retry</button>
        </div>
      )}

      <main className="app-main">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Connecting to database...</p>
          </div>
        ) : viewMode === 'calendar' ? (
          <CalendarView
            onEdit={openEdit}
            onDayClick={date => openNew(date)}
            year={calYear}
            month={calMonth}
            setYear={setCalYear}
            setMonth={setCalMonth}
          />
        ) : (
          <ListView onEdit={openEdit} />
        )}
      </main>

      {modalOpen && (
        <TaskModal taskId={editTaskId} prefillDate={prefillDate} onClose={closeModal} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <AppInner />
    </TaskProvider>
  );
}