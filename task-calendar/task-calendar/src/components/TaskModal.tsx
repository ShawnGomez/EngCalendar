import React, { useState, useEffect } from 'react';
import { Task, TaskType, TASK_TYPE_CONFIG } from '../types';
import { useTasks } from '../context/TaskContext';
import { todayStr } from '../utils/dateUtils';
import './TaskModal.css';

interface Props {
  taskId?: string | null;        // null = new task
  prefillDate?: string | null;   // pre-fill date when clicking a day
  onClose: () => void;
}

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const TYPES: TaskType[] = ['exam', 'assignment', 'quiz', 'project', 'reading', 'other'];

export default function TaskModal({ taskId, prefillDate, onClose }: Props) {
  const { tasks, addTask, updateTask } = useTasks();
  const existing = taskId ? tasks.find(t => t.id === taskId) : null;

  const [name, setName] = useState(existing?.name ?? '');
  const [type, setType] = useState<TaskType>(existing?.type ?? 'assignment');
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? prefillDate ?? todayStr());
  const [dueTime, setDueTime] = useState(existing?.dueTime ?? '');
  const [extraInfo, setExtraInfo] = useState(existing?.extraInfo ?? '');
  const [errors, setErrors] = useState<{ name?: string; dueDate?: string }>({});

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Task name is required.';
    if (!dueDate) e.dueDate = 'Due date is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const task: Task = {
      id: existing?.id ?? makeId(),
      name: name.trim(),
      type,
      dueDate,
      dueTime: dueTime || undefined,
      extraInfo: extraInfo.trim() || undefined,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    existing ? updateTask(task) : addTask(task);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2>{existing ? 'Edit Task' : 'New Task'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>Task Name *</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Chapter 5 Assignment"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="field">
            <label>Type *</label>
            <div className="type-grid">
              {TYPES.map(t => {
                const cfg = TASK_TYPE_CONFIG[t];
                return (
                  <button
                    key={t}
                    className={`type-option${type === t ? ' selected' : ''}`}
                    style={type === t ? { background: cfg.color, borderColor: cfg.color, color: '#fff' } : {}}
                    onClick={() => setType(t)}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Due Date *</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className={errors.dueDate ? 'error' : ''}
              />
              {errors.dueDate && <span className="field-error">{errors.dueDate}</span>}
            </div>
            <div className="field">
              <label>Due Time <span className="optional">(optional)</span></label>
              <input
                type="time"
                value={dueTime}
                onChange={e => setDueTime(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Extra Info <span className="optional">(optional)</span></label>
            <textarea
              value={extraInfo}
              onChange={e => setExtraInfo(e.target.value)}
              placeholder="Notes, instructions, links..."
              rows={3}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSubmit}>
            {existing ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
