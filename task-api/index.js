const express = require('express');
const cors    = require('cors');
const pool    = require('./db');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'https://task-calendar-kohl.vercel.app' }));
app.use(express.json());

// ─── Helpers ─────────────────────────────────────────────────────────────────

// PostgreSQL returns DATE columns as JS Date objects at UTC midnight.
// Reading UTC parts directly avoids timezone shifting the day by one.
function toTask(row) {
  function safeDate(val) {
    if (val instanceof Date) {
      const y = val.getUTCFullYear();
      const m = String(val.getUTCMonth() + 1).padStart(2, '0');
      const d = String(val.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    return String(val).slice(0, 10);
  }

  return {
    id:        row.id,
    name:      row.name,
    type:      row.type,
    dueDate:   safeDate(row.due_date),
    dueTime:   row.due_time   ?? undefined,
    extraInfo: row.extra_info ?? undefined,
    createdAt: row.created_at instanceof Date
                 ? row.created_at.toISOString()
                 : String(row.created_at),
  };
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// get all of the tasks
app.get('/tasks', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM tasks ORDER BY due_date ASC, due_time ASC NULLS LAST'
    );
    res.json(rows.map(toTask));
  } catch (err) {
    console.error('GET /tasks error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// request a singular task
app.get('/tasks/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM tasks WHERE id = $1', [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json(toTask(rows[0]));
  } catch (err) {
    console.error('GET /tasks/:id error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Task creation
app.post('/tasks', async (req, res) => {
  try {
    const { id, name, type, dueDate, dueTime, extraInfo, createdAt } = req.body;
    if (!id || !name || !type || !dueDate) {
      return res.status(400).json({ error: 'id, name, type, and dueDate are required.' });
    }
    const { rows } = await pool.query(`
      INSERT INTO tasks (id, name, type, due_date, due_time, extra_info, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [id, name, type, dueDate, dueTime || null, extraInfo || null, createdAt || new Date()]);
    res.status(201).json(toTask(rows[0]));
  } catch (err) {
    console.error('POST /tasks error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT update task
app.put('/tasks/:id', async (req, res) => {
  try {
    const { name, type, dueDate, dueTime, extraInfo } = req.body;
    const { rows } = await pool.query(`
      UPDATE tasks
      SET name = $1, type = $2, due_date = $3, due_time = $4, extra_info = $5
      WHERE id = $6
      RETURNING *
    `, [name, type, dueDate, dueTime || null, extraInfo || null, req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json(toTask(rows[0]));
  } catch (err) {
    console.error('PUT /tasks/:id error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Task deletion
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING id', [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true, id: rows[0].id });
  } catch (err) {
    console.error('DELETE /tasks/:id error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// The start

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL connected');
    console.log(`API running at http://localhost:${PORT}`);
  } catch (err) {
    console.error('PostgreSQL connection failed:', err.message);
  }
});
