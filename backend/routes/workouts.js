import { Router } from 'express';
import auth from '../middleware/auth.js';
import { getWorkouts, createWorkout, getWorkout, updateWorkout, deleteWorkout, addExercise, addSet, updateSet, deleteSet } from '../controllers/workoutController.js';

const router = Router();
router.use(auth);
router.get('/', getWorkouts);
router.post('/', createWorkout);
router.get('/:id', getWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);
router.post('/:id/exercises', addExercise);
router.post('/exercises/:weId/sets', addSet);
router.put('/sets/:setId', updateSet);
router.delete('/sets/:setId', deleteSet);
export default router;
