import express from 'express';
import { getUser, askToAssitant } from '../controller/user.js';
import { isAuth } from '../middleware/isAuth.js';
import { uploadController } from '../controller/uploadController.js';
import {saveAssitantPrefs} from '../controller/user.js'
import upload from '../middleware/multer.js';

const router = express.Router();

router.get('/user', isAuth, getUser);
router.post('/upload-avatar', isAuth, upload.single('avatar'), uploadController);
router.post('/ask', isAuth, askToAssitant);
router.put('/assistant', isAuth , saveAssitantPrefs);
export default router;
