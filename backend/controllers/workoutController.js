import db from '../db/connection.js';

function parseExercise(ex) {
  if (ex && typeof ex.muscle_groups === 'string') {
    try { ex.muscle_groups = JSON.parse(ex.muscle_groups); } catch { ex.muscle_groups = []; }
  }
  return ex;
}

export function getWorkouts(req, res) {
  const { page = 1, type } = req.query;
  const limit = 20;
  const offset = (page - 1) * limit;
  try {
    let q = 'SELECT * FROM workouts WHERE user_id = ?';
    const params = [req.user.id];
    if (type) { q += ' AND type = ?'; params.push(type); }
    q += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    const rows = db.prepare(q).all(...params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

export function createWorkout(req, res) {
  const { title, type, notes, is_public, started_at } = req.body;
  try {
    const result = db.prepare(
      'INSERT INTO workouts (user_id, title, type, notes, is_public, started_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(req.user.id, title || 'Séance', type || 'custom', notes || '', is_public !== false ? 1 : 0, started_at || new Date().toISOString());
    const workout = db.prepare('SELECT * FROM workouts WHERE id = ?').get(result.lastInsertRowid);
    res.json(workout);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

export function getWorkout(req, res) {
  try {
    const workout = db.prepare(
      'SELECT w.*, u.username, u.avatar_url FROM workouts w JOIN users u ON w.user_id = u.id WHERE w.id = ?'
    ).get(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Séance introuvable' });

    const exs = db.prepare(
      `SELECT we.*, e.name, e.muscle_groups, e.equipment, e.has_distance, e.has_duration
       FROM workout_exercises we JOIN exercises e ON we.exercise_id = e.id
       WHERE we.workout_id = ? ORDER BY we.order_index`
    ).all(req.params.id).map(parseExercise);

    for (const ex of exs) {
      ex.sets = db.prepare('SELECT * FROM sets WHERE workout_exercise_id = ? ORDER BY set_number').all(ex.id);
    }

    const kudosCount = db.prepare('SELECT COUNT(*) as n FROM kudos WHERE workout_id = ?').get(req.params.id).n;
    const userLiked = !!db.prepare('SELECT 1 FROM kudos WHERE workout_id = ? AND user_id = ?').get(req.params.id, req.user.id);

    res.json({ ...workout, exercises: exs, kudos_count: kudosCount, user_liked: userLiked });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

export function updateWorkout(req, res) {
  const { title, type, notes, is_public, completed_at, duration_minutes } = req.body;
  try {
    const current = db.prepare('SELECT * FROM workouts WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!current) return res.status(404).json({ error: 'Séance introuvable' });
    db.prepare(`UPDATE workouts SET
      title = ?, type = ?, notes = ?, is_public = ?, completed_at = ?, duration_minutes = ?
      WHERE id = ?`
    ).run(
      title ?? current.title, type ?? current.type, notes ?? current.notes,
      is_public !== undefined ? (is_public ? 1 : 0) : current.is_public,
      completed_at ?? current.completed_at, duration_minutes ?? current.duration_minutes,
      req.params.id
    );
    res.json(db.prepare('SELECT * FROM workouts WHERE id = ?').get(req.params.id));
  } catch (err) { res.status(500).json({ error: err.message }); }
}

export function deleteWorkout(req, res) {
  try {
    const result = db.prepare('DELETE FROM workouts WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    if (!result.changes) return res.status(404).json({ error: 'Séance introuvable' });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

export function addExercise(req, res) {
  const { exercise_id, order_index } = req.body;
  try {
    const result = db.prepare(
      'INSERT INTO workout_exercises (workout_id, exercise_id, order_index) VALUES (?, ?, ?)'
    ).run(req.params.id, exercise_id, order_index || 0);
    const we = db.prepare('SELECT * FROM workout_exercises WHERE id = ?').get(result.lastInsertRowid);
    const ex = parseExercise(db.prepare('SELECT * FROM exercises WHERE id = ?').get(exercise_id));
    res.json({ ...we, name: ex.name, muscle_groups: ex.muscle_groups, equipment: ex.equipment, has_distance: ex.has_distance, has_duration: ex.has_duration, sets: [] });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

export function addSet(req, res) {
  const { set_number, reps, weight, weight_unit, distance, distance_unit, duration_seconds } = req.body;
  try {
    const result = db.prepare(
      `INSERT INTO sets (workout_exercise_id, set_number, reps, weight, weight_unit, distance, distance_unit, duration_seconds)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(req.params.weId, set_number, reps || null, weight || null, weight_unit || 'kg', distance || null, distance_unit || 'm', duration_seconds || null);
    res.json(db.prepare('SELECT * FROM sets WHERE id = ?').get(result.lastInsertRowid));
  } catch (err) { res.status(500).json({ error: err.message }); }
}

export function updateSet(req, res) {
  const { reps, weight, distance, duration_seconds } = req.body;
  try {
    const current = db.prepare('SELECT * FROM sets WHERE id = ?').get(req.params.setId);
    if (!current) return res.status(404).json({ error: 'Série introuvable' });
    db.prepare('UPDATE sets SET reps = ?, weight = ?, distance = ?, duration_seconds = ? WHERE id = ?').run(
      reps ?? current.reps, weight ?? current.weight, distance ?? current.distance, duration_seconds ?? current.duration_seconds, req.params.setId
    );
    res.json(db.prepare('SELECT * FROM sets WHERE id = ?').get(req.params.setId));
  } catch (err) { res.status(500).json({ error: err.message }); }
}

export function deleteSet(req, res) {
  try {
    db.prepare('DELETE FROM sets WHERE id = ?').run(req.params.setId);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
}
