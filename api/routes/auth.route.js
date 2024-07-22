import express from 'express'
import { signin } from '../controllers/auth.controller.js';
import { signout } from '../controllers/auth.controller.js';
import { verifyToken } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signout', signout);
router.post('/verify-token', verifyToken);

export default router;