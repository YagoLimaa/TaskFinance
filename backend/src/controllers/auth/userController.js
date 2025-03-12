import asyncHandler from 'express-async-handler';
import User from '../../models/auth/UserModel.js';
import gerarToken from '../../helpers/gerarToken.js';
import bcrypt from 'bcrypt';

export const registroUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password){
        // erro 400 é erro de requisição inválida
        return res.status(400).json({message: "Preencha todos os campos"});
    }

    // verificar o tamanho da senha

    if (password.length < 6){
        return res.status(400).json({message: "A senha deve ter no mínimo 6 caracteres"});
    }
    
    // verificar se o email ja existe no banco de dados

    const userExist = await User.findOne({email});


    if (userExist){
        // erro 400 é erro de requisição inválida
        return res.status(400).json({message: "Email já cadastrado"});
    }

    // criar o usuário

    const user = await User.create({
        name,
        email,
        password,
    });

    // gerar o token de autenticação com o id do usuário
    const token = gerarToken(user._id);

    // enviar o token e os dados do usuário para o cliente
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
        sameSite: true,
        secure: true,

    });


    if (user){
        const {_id, name, email, role, photo, bio, isverified} = user;
    
    // usuario criado  201

    res.status(201).json({
        _id,
        name,
        email,
        role,
        photo,
        bio,
        isverified,
        token,
    });
}else{
    return res.status(400).json({message: "Usuário não encontrado"});
}
});


// login do usuário

export const loginUsario = asyncHandler(async (req, res) => {
    // pegar os dados do corpo da requisição

    const {email, password} = req.body;

    // verificar se o email e a senha foram enviados

    if (!email || !password){
        // erro 400 é erro de requisição inválida
        return res.status(400).json({message: "Preencha todos os campos"});
    }

    // checar se o usuário existe no banco de dados

    const userExist = await User.findOne({email});
    if (!userExist){
        // erro 400 é erro de requisição inválida
        return res.status(400).json({message: "usuário não encontrado, registre-se!"});
    }

    
    // verificar se a senha está correta comparando o hash da db
    const isMatch = await bcrypt.compare(password, userExist.password);

    
    if (!isMatch){
        // erro 400 é erro de requisição inválida
        return res.status(400).json({message: "email ou senha incorretos"});
}
    // gerar o token de autenticação com o id do usuário
    const token = gerarToken(userExist._id);
        if (userExist && isMatch){
            const {_id, name, email, role, photo, bio, isverified} = userExist;
        // enviar o token para cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true, 
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
            sameSite: true,
            secure: true,
         });


         // mandar a resposta com os dados do usuário e o token

        res.status(200).json({
            _id,
            name,
            email,
            role,
            photo,
            bio,
            isverified,
            token,
        });
    }else{
        return res.status(400).json({message: "email ou senha incorretos"});
    }
});


// logout do usuário


export const logoutUsuario = asyncHandler(async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({message: "Usuário deslogado"}); 
});