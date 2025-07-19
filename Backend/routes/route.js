import express from 'express';
import { signUp, Login , Logout } from '../controller/auth.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', Login);
router.get('/logout', Logout);

export default router;
