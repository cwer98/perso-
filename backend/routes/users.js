import { Router } from 'express';
import auth from '../middleware/auth.js';
import { getUser, updateUser, getUserWorkouts, getUserStats } from '../controllers/userController.js';

const router = Router();
router.get('/:id', getUser);
router.put('/:id', auth, updateUser);
router.get('/:id/workouts', getUserWorkouts);
router.get('/:id/stats', getUserStats);
export default router;
