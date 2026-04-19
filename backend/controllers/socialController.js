import db from '../db/connection.js';

export function followUser(req, res) {
  if (parseInt(req.params.userId) === req.user.id) return res.status(400).json({ error: 'Impossible de vous suivre vous-même' });
  try {
    db.prepare('INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)').run(req.user.id, req.params.userId);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

export function unfollowUser(req, res) {
  try {
    db.prepare('DELETE FROM follows WHERE follower_id = ? AND following_id = ?').run(req.user.id, req.params.userId);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

export function addKudos(req, res) {
  try {
    db.prepare('INSERT OR IGNORE INTO kudos (user_id, workout_id) VALUES (?, ?)').run(req.user.id, req.params.workoutId);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

export function removeKudos(req, res) {
  try {
    db.prepare('DELETE FROM kudos WHERE user_id = ? AND workout_id = ?').run(req.user.id, req.params.workoutId);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

export function addComment(req, res) {
  const { content } = req.body;
  if (!content?.trim()) return res.status(400).json({ error: 'Commentaire vide' });
  try {
    const result = db.prepare('INSERT INTO comments (user_id, workout_id, content) VALUES (?, ?, ?)').run(req.user.id, req.params.workoutId, content.trim());
    const comment = db.prepare('SELECT c.*, u.username, u.avatar_url FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?').get(result.lastInsertRowid);
    res.json(comment);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

export function getComments(req, res) {
  try {
    const rows = db.prepare('SELECT c.*, u.username, u.avatar_url FROM comments c JOIN users u ON c.user_id = u.id WHERE c.workout_id = ? ORDER BY c.created_at ASC').all(req.params.workoutId);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
}
