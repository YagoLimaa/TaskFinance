import express from 'express';
import { loginUsario,logoutUsuario,registroUser,getPefilUsuario,updateUsuario, UsarioStatusLogin, } from '../controllers/auth/userController.js';
import { adminMiddleware, admSupremo, protect } from '../middleware/authMiddleware.js';
import { deleteUsuario, getUsuarios } from '../controllers/auth/ControleAdmin.js';



const router = express.Router();

router.post("/registro", registroUser);
router.post("/login", loginUsario);    
router.get("/logout", logoutUsuario);
router.get("/usuario", protect, getPefilUsuario);
router.patch("/usuario", protect, updateUsuario);


// rotas do adm

router.delete("/admin/usuario/:id", protect,adminMiddleware, deleteUsuario);


// pegar todos os usuários

router.get("/admin/usuarios", protect, admSupremo, getUsuarios);


// status de login

router.get("/status",UsarioStatusLogin);




export default router;
