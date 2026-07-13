-- the default setup for testing purposes
CREATE DATABASE taskcal;

\c taskcal

CREATE TABLE IF NOT EXISTS tasks (
  id          VARCHAR(50)   PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  type        VARCHAR(50)   NOT NULL,
  due_date    DATE          NOT NULL,
  due_time    TIME,
  extra_info  TEXT,
  created_at  TIMESTAMPTZ   DEFAULT NOW()
);

-- Optional sample rows (safe to re-run, skips duplicates)
INSERT INTO tasks (id, name, type, due_date, due_time, extra_info) VALUES
  ('seed-1', 'Calculus Final Exam', 'exam',       '2026-07-20', '09:00', 'Chapters 8-12, bring calculator.'),
  ('seed-2', 'History Essay',       'assignment', '2026-07-10',  NULL,   '1500 words, MLA format.'),
  ('seed-3', 'Biology Quiz',        'quiz',       '2026-07-05', '11:00', 'Chapter 3 only.')
ON CONFLICT (id) DO NOTHING;
