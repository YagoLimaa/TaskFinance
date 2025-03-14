import express from 'express';
import { loginUsario,logoutUsuario,registroUser,getPefilUsuario,updateUsuario, UsarioStatusLogin, EmailVerificar, UsuarioVerificar, RedefinirSenha, TokenRedefinirSenha, } from '../controllers/auth/userController.js';
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


// verificar email do usuario
router.post("/verificar-email", protect, EmailVerificar);

// verificao do usuario >> email
router.post("/verificar-usuario/:verificationToken", UsuarioVerificar);

// redefinir senha
router.post("/redefinir-senha", RedefinirSenha);

// redifinir senha >> token
router.post("/senha-redefinir/:senhatoken", TokenRedefinirSenha);

export default router;
