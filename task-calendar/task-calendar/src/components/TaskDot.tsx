import React, { useState, useRef } from 'react';
import { Task, TASK_TYPE_CONFIG } from '../types';
import { formatDate, getTimeLeft } from '../utils/dateUtils';
import './TaskDot.css';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskDot({ task, onEdit, onDelete }: Props) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cfg = TASK_TYPE_CONFIG[task.type];
  const timeLeft = getTimeLeft(task.dueDate, task.dueTime);
  const isOverdue = timeLeft === 'Overdue';

  return (
    <div
      className="task-dot-wrapper"
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="task-dot"
        style={{ background: cfg.color }}
        title={task.name}
      />
      {hovered && (
        <div className="task-tooltip">
          <div className="tooltip-header" style={{ background: cfg.color }}>
            <span className="tooltip-type">{cfg.label}</span>
            <span className="tooltip-name">{task.name}</span>
          </div>
          <div className="tooltip-body">
            <div className="tooltip-row">
              <span className="tooltip-label">Due</span>
              <span>{formatDate(task.dueDate)}{task.dueTime ? ` at ${task.dueTime}` : ''}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Status</span>
              <span className={isOverdue ? 'overdue' : 'on-track'}>{timeLeft}</span>
            </div>
            {task.extraInfo && (
              <div className="tooltip-extra">{task.extraInfo}</div>
            )}
            <div className="tooltip-actions">
              <button onClick={() => onEdit(task)} className="btn-edit">Edit</button>
              <button onClick={() => onDelete(task.id)} className="btn-delete">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
