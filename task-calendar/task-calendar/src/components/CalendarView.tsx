import React from 'react';
import { useTasks } from '../context/TaskContext';
import { buildCalendarWeeks, todayStr } from '../utils/dateUtils';
import TaskDot from './TaskDot';
import './CalendarView.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

interface Props {
  onEdit: (taskId: string) => void;
  onDayClick: (date: string) => void;
  year: number;
  month: number;
  setYear: (y: number) => void;
  setMonth: (m: number) => void;
}

export default function CalendarView({ onEdit, onDayClick, year, month, setYear, setMonth }: Props) {
  const { tasks, deleteTask } = useTasks();
  const today = todayStr();

  const weeks = buildCalendarWeeks(year, month);

  const tasksByDate = tasks.reduce<Record<string, typeof tasks>>((acc, t) => {
    acc[t.dueDate] = acc[t.dueDate] ? [...acc[t.dueDate], t] : [t];
    return acc;
  }, {});

  function prev() {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  }
  function next() {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  }
  function goToday() {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  }

  return (
    <div className="calendar-view">
      <div className="cal-header">
        <button className="nav-btn" onClick={prev}>&#8249;</button>
        <div className="cal-title-group">
          <h2 className="cal-month">{MONTHS[month]} {year}</h2>
          <button className="today-btn" onClick={goToday}>Today</button>
        </div>
        <button className="nav-btn" onClick={next}>&#8250;</button>
      </div>

      <div className="cal-grid">
        {DAYS.map(d => (
          <div key={d} className="day-header">{d}</div>
        ))}
        {weeks.map((week, wi) =>
          week.map((dateStr, di) => {
            const isToday = dateStr === today;
            const dayTasks = dateStr ? (tasksByDate[dateStr] || []) : [];
            return (
              <div
                key={`${wi}-${di}`}
                className={`day-cell${!dateStr ? ' empty' : ''}${isToday ? ' today' : ''}`}
                onClick={() => dateStr && onDayClick(dateStr)}
              >
                {dateStr && (
                  <>
                    <span className={`day-num${isToday ? ' today-num' : ''}`}>
                      {parseInt(dateStr.split('-')[2], 10)}
                    </span>
                    <div className="dots-row">
                      {dayTasks.slice(0, 6).map(task => (
                        <TaskDot
                          key={task.id}
                          task={task}
                          onEdit={() => onEdit(task.id)}
                          onDelete={deleteTask}
                        />
                      ))}
                      {dayTasks.length > 6 && (
                        <span className="more-tasks">+{dayTasks.length - 6}</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}