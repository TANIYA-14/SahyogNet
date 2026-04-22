import express from 'express';
import { getVolunteers, createVolunteer } from '../controllers/volunteersController.js';

const router = express.Router();

router.get('/', getVolunteers);
router.post('/', createVolunteer);

export default router;
