import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/auth/UserModel.js';
export const protect = asyncHandler(async (req, res, next) => {

    try{
        // verificar se o usuario ta logado

            const token = req.cookies.token;
            if (!token){

                // erro 401 é erro de não autorizado
                return res.status(401).json({message: "Não autorizado, faça login"});
            }
            // verificar se o token é válido
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // pegar o id do usuário e excluir a senha

            const user = await User.findById(decoded.id).select("-password");
            // verificar se o usuário existe
            if (!user){
                // erro 404 é erro de não encontrado
                return res.status(404).json({message: "Usuário não encontrado"});
            }
            // passar o usuário para o próximo middleware
            req.user = user;

            next();
    }catch(error){
        // erro 401 é erro de não autorizado
        return res.status(401).json({message: "Não autorizado, faça login"});
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