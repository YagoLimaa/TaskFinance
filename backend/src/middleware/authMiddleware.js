import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/auth/UserModel.js';
import bcrypt from "bcrypt";

export const protect = asyncHandler(async (req, res, next) => {
  try {
    // Verificar se o usuário está logado
    const token = req.cookies.token;
    if (!token) {
      // Erro 401: Não autorizado
      return res.status(401).json({ message: "Não autorizado, faça login." });
    }

    // Verificar se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Pegar o ID do usuário e incluir a senha
    const user = await User.findById(decoded.id);
    if (!user) {
      // Erro 404: Usuário não encontrado
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Passar o usuário para o próximo middleware
    req.user = user;

    next();
  } catch (error) {
    // Erro 401: Não autorizado
    return res.status(401).json({ message: "Não autorizado, faça login." });
  }
});

// admin middleware

export const adminMiddleware = asyncHandler(async (req, res, next) => {
    if ((req.user && req.user.role === "admin") || (req.user && req.user.role === "adminSupremo")){
        // passar para o próximo middleware se o usuário for admin
        next();
        return
    }

    // erro 403 é erro de proibido se nao for adm
    return res.status(403).json({message: "Não autorizado."});
});

export const admSupremo = asyncHandler(async (req, res, next) => {
    if ((req.user && req.user.role === "adminSupremo") || (req.user && req.user.role === "admin")){
        // passar para o próximo middleware se o usuário for admin
        next();
        return
    }

    // erro 403 é erro de proibido se nao for adm
    return res.status(403).json({message: "Não autorizado."});

});

// verificar se o usuario ta verificado

export const verificado = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isVerified === true){
        // passar para o próximo middleware se o usuário for admin
        next();
        return
    }

    // erro 403 é erro de proibido se nao for adm
    return res.status(403).json({message: "Verifique seu email para continuar!"});
});

export const mudarSenha = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // O usuário autenticado é obtido do middleware `protect`
    const user = req.user;

    // Verifique se a senha atual está correta
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Senha atual incorreta" });
    }

    // Verifique se a nova senha é diferente da senha atual
    if (await bcrypt.compare(newPassword, user.password)) {
      return res.status(400).json({ message: "A nova senha não pode ser igual à senha atual" });
    }

    // Atualize a senha do usuário
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Senha alterada com sucesso" });
  } catch (error) {
    console.error("Erro ao alterar a senha:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};