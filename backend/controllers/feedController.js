import db from '../db/connection.js';

export function getFeed(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const offset = (page - 1) * limit;
  try {
    const workouts = db.prepare(`
      SELECT w.*, u.username, u.avatar_url
      FROM workouts w JOIN users u ON w.user_id = u.id
      WHERE (w.user_id IN (SELECT following_id FROM follows WHERE follower_id = ?) OR w.user_id = ?)
        AND w.is_public = 1 AND w.completed_at IS NOT NULL
      ORDER BY w.created_at DESC LIMIT ? OFFSET ?`
    ).all(req.user.id, req.user.id, limit, offset);

    for (const w of workouts) {
      w.kudos_count = db.prepare('SELECT COUNT(*) as n FROM kudos WHERE workout_id = ?').get(w.id).n;
      w.comments_count = db.prepare('SELECT COUNT(*) as n FROM comments WHERE workout_id = ?').get(w.id).n;
      w.user_liked = !!db.prepare('SELECT 1 FROM kudos WHERE workout_id = ? AND user_id = ?').get(w.id, req.user.id);
      w.exercises = db.prepare(`
        SELECT e.name, e.primary_muscle,
          (SELECT COUNT(*) FROM sets s WHERE s.workout_exercise_id = we.id) as sets_count
        FROM workout_exercises we JOIN exercises e ON e.id = we.exercise_id
        WHERE we.workout_id = ? ORDER BY we.order_index`
      ).all(w.id);
    }

    res.json(workouts);
  } catch (err) { res.status(500).json({ error: err.message }); }
}
