import express from 'express';
import { generateLayoutImages, generateSingleLayout } from '../controllers/layoutVisualizationController.js';

const router = express.Router();

// POST /api/layout-visualization/generate-multiple
router.post('/generate-multiple', generateLayoutImages);

// POST /api/layout-visualization/generate-single
router.post('/generate-single', generateSingleLayout);

export default router;
