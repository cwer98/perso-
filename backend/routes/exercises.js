import { Router } from 'express';
import { getExercises } from '../controllers/exerciseController.js';

const router = Router();
router.get('/', getExercises);
export default router;
