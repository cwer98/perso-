import db from '../db/connection.js';

export function getExercises(req, res) {
  const { muscle, equipment, search } = req.query;
  try {
    let q = 'SELECT * FROM exercises WHERE 1=1';
    const params = [];
    if (muscle) { q += ' AND muscle_groups LIKE ?'; params.push(`%"${muscle}"%`); }
    if (equipment) { q += ' AND equipment = ?'; params.push(equipment); }
    if (search) { q += ' AND name LIKE ?'; params.push(`%${search}%`); }
    q += ' ORDER BY name';
    const rows = db.prepare(q).all(...params).map(ex => {
      try { ex.muscle_groups = JSON.parse(ex.muscle_groups); } catch { ex.muscle_groups = []; }
      ex.has_distance = !!ex.has_distance;
      ex.has_duration = !!ex.has_duration;
      return ex;
    });
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
}
