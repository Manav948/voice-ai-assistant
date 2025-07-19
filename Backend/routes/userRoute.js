import express from 'express';
import { getUser, askToAssitant } from '../controller/user.js';
import { isAuth } from '../middleware/isAuth.js';
import { uploadController } from '../controller/uploadController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.get('/user', isAuth, getUser);
router.post('/upload-avatar', isAuth, upload.single('avatar'), uploadController);
router.post('/ask', isAuth, askToAssitant);

export default router;
