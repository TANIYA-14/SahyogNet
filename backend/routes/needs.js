import express from 'express';
import { createNeed, getNeeds, getNeedById, updateNeedStatus } from '../controllers/needsController.js';

const router = express.Router();

router.post('/', createNeed);
router.get('/', getNeeds);
router.get('/:id', getNeedById);
router.patch('/:id/status', updateNeedStatus);

export default router;
