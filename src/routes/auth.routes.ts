import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', registerUser); // ✅ Register user
router.post('/login', loginUser); // ✅ Login user

export default router;
