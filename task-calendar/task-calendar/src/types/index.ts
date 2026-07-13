export type TaskType = 'exam' | 'assignment' | 'quiz' | 'project' | 'reading' | 'other';

export interface Task {
  id: string;
  name: string;
  type: TaskType;
  dueDate: string; // ISO date string YYYY-MM-DD
  dueTime?: string; // HH:MM
  extraInfo?: string;
  createdAt: string;
}

export type ViewMode = 'calendar' | 'list';

export const TASK_TYPE_CONFIG: Record<TaskType, { label: string; color: string; bg: string }> = {
  exam:       { label: 'Exam',       color: '#EF4444', bg: '#FEE2E2' },
  assignment: { label: 'Assignment', color: '#3B82F6', bg: '#DBEAFE' },
  quiz:       { label: 'Quiz',       color: '#F59E0B', bg: '#FEF3C7' },
  project:    { label: 'Project',    color: '#8B5CF6', bg: '#EDE9FE' },
  reading:    { label: 'Reading',    color: '#10B981', bg: '#D1FAE5' },
  other:      { label: 'Other',      color: '#6B7280', bg: '#F3F4F6' },
};
