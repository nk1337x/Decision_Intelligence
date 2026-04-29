import express from 'express';
import { analyzeEventOptions } from '../controllers/eventPlanningController.js';

const router = express.Router();

router.post('/analyze', analyzeEventOptions);

export default router;
