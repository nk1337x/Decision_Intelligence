import express from 'express';
import { generateEventOptions } from '../controllers/eventPlanningGenerateController.js';

const router = express.Router();

router.post('/generate', generateEventOptions);

export default router;
