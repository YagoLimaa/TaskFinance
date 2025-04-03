import express from 'express';
import { loginUsario,logoutUsuario,registroUser,getPefilUsuario,updateUsuario, UsarioStatusLogin, EmailVerificar, UsuarioVerificar, RedefinirSenha, TokenRedefinirSenha, MudarSenha, ValidarToken, updateAdminUser } from '../controllers/auth/userController.js';
import { adminMiddleware, admSupremo, protect } from '../middleware/authMiddleware.js';
import { deleteUsuario, getUsuarios, verificarEmail } from '../controllers/auth/ControleAdmin.js';


const router = express.Router();


router.post("/registro", registroUser);
router.post("/login", loginUsario);    
router.get("/logout", logoutUsuario);
router.get("/usuario", protect, getPefilUsuario);
router.patch("/usuario", protect, updateUsuario);


// rotas do adm
router.delete("/admin/usuario/:id", protect,adminMiddleware, deleteUsuario);
router.patch("/admin/usuario/:id", protect, admSupremo, updateAdminUser);
router.get("/admin/usuarios", protect, adminMiddleware, getUsuarios);

// status de login
router.get("/status",UsarioStatusLogin);

// verificar email do usuario
router.post("/verificar-email", protect, EmailVerificar);

// Verificar se o e-mail já está em uso
router.get("/verificar-email-existente", verificarEmail);

// verificao do usuario >> email
router.post("/verificar-usuario/:verificationToken", UsuarioVerificar);

// redefinir senha
router.post("/redefinir-senha", RedefinirSenha);

// redifinir senha >> token
router.patch("/senha-redefinir/:senhatoken", TokenRedefinirSenha);

// mudar a senha
router.patch("/mudar-senha", protect, MudarSenha);

router.get("/validate-token/:senhatoken", ValidarToken)

export default router;
