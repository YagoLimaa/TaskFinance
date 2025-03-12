import express from 'express';
import { loginUsario, registroUser } from '../controllers/auth/userController.js';


const router = express.Router();

router.post("/registro", registroUser);
router.post("/login", loginUsario);    

export default router;
