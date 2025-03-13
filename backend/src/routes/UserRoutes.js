import express from 'express';
import { loginUsario,logoutUsuario,registroUser,getPefilUsuario,updateUsuario, } from '../controllers/auth/userController.js';
import { protect } from '../middleware/authMiddleware.js';



const router = express.Router();

router.post("/registro", registroUser);
router.post("/login", loginUsario);    
router.get("/logout", logoutUsuario);
router.get("/usuario", protect, getPefilUsuario);
router.patch("/usuario", protect, updateUsuario);

export default router;
