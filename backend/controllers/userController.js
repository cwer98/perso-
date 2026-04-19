import db from '../db/connection.js';

export function getUser(req, res) {
  try {
    const user = db.prepare('SELECT id, username, bio, avatar_url, created_at FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
    const followers = db.prepare('SELECT COUNT(*) as n FROM follows WHERE following_id = ?').get(req.params.id).n;
    const following = db.prepare('SELECT COUNT(*) as n FROM follows WHERE follower_id = ?').get(req.params.id).n;
    const total_workouts = db.prepare('SELECT COUNT(*) as n FROM workouts WHERE user_id = ?').get(req.params.id).n;
    res.json({ ...user, followers, following, total_workouts });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

export function updateUser(req, res) {
  const { username, bio, avatar_url } = req.body;
  if (parseInt(req.params.id) !== req.user.id) return res.status(403).json({ error: 'Non autorisé' });
  try {
    const current = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    db.prepare('UPDATE users SET username = ?, bio = ?, avatar_url = ? WHERE id = ?').run(
      username ?? current.username, bio ?? current.bio, avatar_url ?? current.avatar_url, req.params.id
    );
    res.json(db.prepare('SELECT id, username, email, bio, avatar_url FROM users WHERE id = ?').get(req.params.id));
  } catch (err) { res.status(500).json({ error: err.message }); }
}

export function getUserWorkouts(req, res) {
  try {
    const rows = db.prepare('SELECT * FROM workouts WHERE user_id = ? AND is_public = 1 ORDER BY created_at DESC LIMIT 20').all(req.params.id);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

export function getUserStats(req, res) {
  try {
    const total_workouts = db.prepare('SELECT COUNT(*) as n FROM workouts WHERE user_id = ?').get(req.params.id).n;
    const total_minutes = db.prepare('SELECT COALESCE(SUM(duration_minutes), 0) as n FROM workouts WHERE user_id = ?').get(req.params.id).n;
    const max_weight = db.prepare(`
      SELECT COALESCE(MAX(s.weight), 0) as n FROM sets s
      JOIN workout_exercises we ON we.id = s.workout_exercise_id
      JOIN workouts w ON w.id = we.workout_id WHERE w.user_id = ?`
    ).get(req.params.id).n;

    const weekly = db.prepare(`
      SELECT strftime('%Y-%W', created_at) as week, COUNT(*) as count, COALESCE(SUM(duration_minutes), 0) as minutes
      FROM workouts WHERE user_id = ? GROUP BY week ORDER BY week DESC LIMIT 12`
    ).all(req.params.id).reverse();

    const exerciseRecords = db.prepare(`
      SELECT e.name, MAX(s.weight) as max_weight
      FROM sets s
      JOIN workout_exercises we ON we.id = s.workout_exercise_id
      JOIN exercises e ON e.id = we.exercise_id
      JOIN workouts w ON w.id = we.workout_id
      WHERE w.user_id = ? AND s.weight IS NOT NULL
      GROUP BY e.name ORDER BY max_weight DESC LIMIT 10`
    ).all(req.params.id);

    const byExercise = exerciseRecords.map(r => {
      const history = db.prepare(`
        SELECT w.created_at as date, s.weight FROM sets s
        JOIN workout_exercises we ON we.id = s.workout_exercise_id
        JOIN exercises e ON e.id = we.exercise_id
        JOIN workouts w ON w.id = we.workout_id
        WHERE w.user_id = ? AND e.name = ? AND s.weight IS NOT NULL
        ORDER BY w.created_at`
      ).all(req.params.id, r.name);
      return { ...r, history };
    });

    res.json({ total_workouts, total_minutes, max_weight, weekly, by_exercise: byExercise });
  } catch (err) { res.status(500).json({ error: err.message }); }
}
