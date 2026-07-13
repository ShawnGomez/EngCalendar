import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Task, TASK_TYPE_CONFIG, TaskType } from '../types';
import { formatDate, getTimeLeft } from '../utils/dateUtils';
import './ListView.css';

interface Props {
  onEdit: (taskId: string) => void;
}

type SortKey = 'dueDate' | 'name' | 'type';

export default function ListView({ onEdit }: Props) {
  const { tasks, deleteTask } = useTasks();
  const [filterType, setFilterType] = useState<TaskType | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = tasks.filter(t => filterType === 'all' || t.type === filterType);
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'dueDate') cmp = a.dueDate.localeCompare(b.dueDate);
    else if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
    else if (sortKey === 'type') cmp = a.type.localeCompare(b.type);
    return sortAsc ? cmp : -cmp;
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <span className="sort-icon neutral">↕</span>;
    return <span className="sort-icon active">{sortAsc ? '↑' : '↓'}</span>;
  }

  return (
    <div className="list-view">
      <div className="list-toolbar">
        <div className="filter-chips">
          {(['all', 'exam', 'assignment', 'quiz', 'project', 'reading', 'other'] as const).map(type => (
            <button
              key={type}
              className={`chip${filterType === type ? ' active' : ''}`}
              style={filterType === type && type !== 'all'
                ? { background: TASK_TYPE_CONFIG[type as TaskType].color, color: '#fff', borderColor: TASK_TYPE_CONFIG[type as TaskType].color }
                : {}}
              onClick={() => setFilterType(type)}
            >
              {type === 'all' ? 'All' : TASK_TYPE_CONFIG[type as TaskType].label}
            </button>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No tasks here yet.</p>
          <span>Click <strong>+ Add Task</strong> to get started.</span>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="task-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('name')} className="sortable">
                  Task Name <SortIcon k="name" />
                </th>
                <th onClick={() => toggleSort('type')} className="sortable">
                  Type <SortIcon k="type" />
                </th>
                <th onClick={() => toggleSort('dueDate')} className="sortable">
                  Time Left <SortIcon k="dueDate" />
                </th>
                <th>Extra Info</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(task => {
                const cfg = TASK_TYPE_CONFIG[task.type];
                const timeLeft = getTimeLeft(task.dueDate, task.dueTime);
                const isOverdue = timeLeft === 'Overdue';
                return (
                  <tr key={task.id}>
                    <td className="name-cell">
                      <span
                        className="type-dot"
                        style={{ background: cfg.color }}
                      />
                      <span className="task-name">{task.name}</span>
                    </td>
                    <td>
                      <span
                        className="type-badge"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td>
                      <div className={`time-cell${isOverdue ? ' overdue' : ''}`}>
                        <span className="time-left">{timeLeft}</span>
                        <span className="due-date">{formatDate(task.dueDate)}{task.dueTime ? ` · ${task.dueTime}` : ''}</span>
                      </div>
                    </td>
                    <td className="extra-cell">
                      {task.extraInfo || <span className="no-info">—</span>}
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="row-btn edit" onClick={() => onEdit(task.id)}>Edit</button>
                        <button className="row-btn delete" onClick={() => deleteTask(task.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
