import { Router } from 'express';
import auth from '../middleware/auth.js';
import { followUser, unfollowUser, addKudos, removeKudos, addComment, getComments } from '../controllers/socialController.js';

const router = Router();
router.use(auth);
router.post('/follow/:userId', followUser);
router.delete('/follow/:userId', unfollowUser);
router.post('/kudos/:workoutId', addKudos);
router.delete('/kudos/:workoutId', removeKudos);
router.post('/comments/:workoutId', addComment);
router.get('/comments/:workoutId', getComments);
export default router;
