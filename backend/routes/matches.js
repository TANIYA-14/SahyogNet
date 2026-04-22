import express from 'express';
import { getMatches, createAssignment } from '../controllers/matchController.js';

const router = express.Router();

router.get('/matches/:need_id', getMatches);
router.post('/assignments', createAssignment);

export default router;
