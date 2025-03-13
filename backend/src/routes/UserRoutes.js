import express from 'express';
import { loginUsario,logoutUsuario,registroUser,getPefilUsuario,updateUsuario, } from '../controllers/auth/userController.js';
import { adminMiddleware, protect } from '../middleware/authMiddleware.js';
import { deleteUsuario } from '../controllers/auth/ControleAdmin.js';



const router = express.Router();

router.post("/registro", registroUser);
router.post("/login", loginUsario);    
router.get("/logout", logoutUsuario);
router.get("/usuario", protect, getPefilUsuario);
router.patch("/usuario", protect, updateUsuario);


// rotas do adm

router.delete("/admin/usuario/:id", protect,adminMiddleware, deleteUsuario);


export default router;
