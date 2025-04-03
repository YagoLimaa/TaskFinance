import asyncHandler from 'express-async-handler';
import User from '../../models/auth/UserModel.js';
import gerarToken from '../../helpers/gerarToken.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Token from '../../models/auth/Token.js';
import crypto from 'node:crypto';
import hashToken from '../../helpers/TokenHash.js';
import sendEmail from '../../helpers/EmailSend.js';
import { log } from 'node:console';


const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const registroUser = asyncHandler(async (req, res) => {
    let {name, email, password} = req.body;

    if (!name || !email || !password){
        // erro 400 é erro de requisição inválida
        return res.status(400).json({message: "Preencha todos os campos"});
    }

    // Verificar o tamanho da senha

    if (password.length < 6){
        return res.status(400).json({message: "A senha deve ter no mínimo 6 caracteres"});
    }
    
    // verificar se o email ja existe no banco de dados

    const userExist = await User.findOne({email});


    if (userExist){
        // erro 400 é erro de requisição inválida
        return res.status(400).json({message: "Email já cadastrado"});
    }

    // Capitalizar a primeira letra do nome
    name = capitalizeFirstLetter(name);
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
            sameSite: "none",
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


// pegar o perfil do usuário

export const getPefilUsuario = asyncHandler(async (req, res) => {
    // pegar o detalhes do usuário usando token
    const user = await User.findById(req.user._id).select("-password");
    if (user){
        res.status(200).json(user);
    }else{
        // erro 404 é erro de não encontrado
        return res.status(404).json({message: "Usuário não encontrado"});
    }
});


// atualizar o perfil do usuário
export const updateUsuario = asyncHandler(async (req, res) => {
  const { name, bio } = req.body; // Removemos o e-mail da requisição

  try {
    // Buscar o usuário atual no banco de dados
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Atualizar os outros campos
    user.name = name || user.name;
    user.bio = bio || user.bio;

    // Salvar as alterações no banco de dados
    const atualizado = await user.save();

    res.status(200).json({
      message: "Perfil atualizado com sucesso",
      user: {
        _id: atualizado._id,
        name: atualizado.name,
        email: atualizado.email, // O e-mail permanece inalterado
        bio: atualizado.bio,
        isverified: atualizado.isverified,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar o perfil:", error);
    res.status(500).json({ message: "Erro ao atualizar o perfil" });
  }
});

export const updateAdminUser = asyncHandler(async (req, res) => {
  const { id } = req.params; // ID do usuário a ser atualizado
  const { name, email, bio, role } = req.body; // Dados enviados pelo frontend
  const loggedUserRole = req.user.role; // Papel do usuário logado

  try {
    // Verificar se o usuário logado tem permissão para alterar outros usuários
    if (loggedUserRole !== "admin" && loggedUserRole !== "adminSupremo") {
      return res.status(403).json({ message: "Você não tem permissão para alterar outros usuários" });
    }

    // Encontrar o usuário pelo ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Verificar se o e-mail foi alterado
    if (email && email !== user.email) {
      // Apenas admin ou adminSupremo podem alterar o e-mail
      if (loggedUserRole === "admin" || loggedUserRole === "adminSupremo") {
        // Verificar se o novo e-mail já está em uso por OUTRO usuário
        const emailExists = await User.findOne({
          email,
          _id: { $ne: id }, // Excluir o próprio usuário da busca
        });

        if (emailExists) {
          return res.status(400).json({ message: "E-mail já está em uso" });
        }

        // Atualizar o e-mail
        user.email = email;
      } else {
        return res.status(403).json({ message: "Você não tem permissão para alterar o e-mail" });
      }
    }

    // Atualizar os outros campos
    if (name) {
      user.name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(); // Capitalizar o nome
    }
    if (bio !== undefined) {
      user.bio = bio;
    }
    if (role && loggedUserRole === "adminSupremo") {
      user.role = role; // Apenas adminSupremo pode alterar o papel
    }

    // Salvar as alterações
    const updatedUser = await user.save();

    res.status(200).json({
      message: "Usuário atualizado com sucesso",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erro ao atualizar o usuário:", error);
    res.status(500).json({ message: "Erro ao atualizar o usuário" });
  }
});

// status de login

export const UsarioStatusLogin = asyncHandler(async (req, res) => {

    const token = req.cookies.token;

    if (!token){
        // erro 401 é erro de não autorizado
        return res.status(401).json({message: "Usuário não logado, faça login para continuar!"});
    }
    // fazendo a verificação do token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded){
        // se o token for válido retornar o status 200
        return res.status(200).json(true);
    }else {
        // erro 401 é erro de não autorizado
        return res.status(401).json(false);
    }
});



// verificar email do usuário

export const EmailVerificar = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    // verificar se o usuario existe

    if (!user){
        // erro 404 é erro de não encontrado
        return res.status(404).json({message: "Usuário não encontrado"});
    }
    if (user.isverified){
        return res.status(200).json({message: "Email já verificado"});
    }


    let token = await Token.findOne({userId: user._id});



    // se o token existir > deletar o token

    if (token){
        await token.deleteOne();
    }


    // ciar uma verificação de token usando o user id ( fzer com que expire com um tempo)

    const verificationToken = crypto.randomBytes(64).toString("hex") + user._id;
    
    // verificar o token hash

    const hashedToken = hashToken(verificationToken);

    const newToken = new Token({
        userId: user._id,
        verificationToken: hashedToken,
        createdAt: Date.now(),
        expireAt: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
    });

    await newToken.save();

    // verificar o link

    const LinkVerificacao = `${process.env.CLIENT_URL}/verificar-usuario/${verificationToken}`;

    // mandar email para o usuario sobre a verificação

    const emailData = "Verificação de Email - TaskFinance";
    const sent_to = user.email;
    const reply_to = "noreply@taskfinance.com";
    const template = "VerificacaoEmail";
    const send_from = process.env.USER_EMAIL;
    const name = user.name;
    const link = LinkVerificacao; 

    try {
        await sendEmail(emailData, sent_to, reply_to, template, send_from, name, link);
        return res.status(200).json({message: "Email de verificação enviado"});
    } catch (error) {
        console.log("Erro ao mandar o email: ", error);
        return res.status(500).json({message: "Erro ao mandar o email"});
    }

});

// verificar o usuario >> email

export const UsuarioVerificar = asyncHandler(async (req, res) => {
    const { verificationToken } = req.params;

    if(!verificationToken){
        return res.status(400).json({message: "Token de verificação não encontrado"});
    }

    // verificar o token hash
    const hashedToken = hashToken(verificationToken);

    // Achar o usuario com o token de verificacao

    const UsuarioToken = await Token.findOne({
        verificationToken: hashedToken,
        // checar se nao ta expirado o token
        expireAt: {$gt: Date.now()},
    });
    if (!UsuarioToken) {
        return res.status(400).json({ message: "Token inválido ou expirado" });
    }

    // Verificar o usuário
    const user = await User.findById(UsuarioToken.userId);

    if(user.isverified){
        return res.status(400).json({message: "Email já verificado!"});
    }else{
        user.isverified = true;
        await user.save();
        return res.status(200).json({ message: "Email verificado com sucesso!" });
    }
});

// esqueci minha senha

export const RedefinirSenha = asyncHandler (async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Por favor, insira um email! " });
    }

    // fvalidar se o usuario existe

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    // verificar se um token existe

    let token = await Token.findOne({ userId: user._id});

    if (token) {
        await token.deleteOne();
    }

    // criar um token de verificação que expira em 1h
    const passwordResetToken = crypto.randomBytes(64).toString("hex") + user._id;

    // hash token antes de salvar no banco de dados

    const hashedToken = hashToken(passwordResetToken);
    
    await new Token({
        userId: user._id,
        passwordResetToken: hashedToken,
        createdAt: Date.now(),
        expireAt: Date.now() + 60 * 60 * 1000, // 1 hora
    }).save();



    // link de reset para o usuario via email

    const resetlink = `${process.env.Client_URL}/senha-redefinir/${passwordResetToken}`;

    const emailData = "Redefinição de Senha - TaskFinance";
    const send_to = user.email;
    const reply_to = "noreply@taskfinance.com";
    const template = "PasswordReset";
    const send_from = process.env.USER_EMAIL;
    const name = user.name;
    const link = resetlink;

    


    
    try {
        await sendEmail(emailData, send_to, reply_to, template, send_from, name, link);
        res.status(200).json({ message: "Email de redefinição de senha enviado com sucesso!" });
    } catch (error) {
        console.log("Erro ao enviar o email de redefinição de senha", error);

        return res.status(500).json({ message: "Erro ao enviar o email de redefinição de senha" });
        
    }
});



// redefinir senha >> token


    export const TokenRedefinirSenha = asyncHandler (async (req, res) => {
    const { senhatoken } = req.params;
    const { password } = req.body;

    //hash token, então comparar com o token no banco de dados
    const hashedToken = hashToken(senhatoken);

    // encontrar token no banco de dados se exuste e nao esta expirado
    const userToken = await Token.findOne({ 
        passwordResetToken: hashedToken, 
        expireAt: { $gt: Date.now() 
        },
    });

    if(!userToken) {
        return res.status(404).json({ message: "Token inválido ou expirado!" });
    }
    // encontrar o usuario pelo id
    const user = await User.findOne(userToken.userId);

    // fazer atuazliazacao da senha
    user.password = password;
    await user.save();

      // Remover o token de redefinição de senha do banco de dados
      await userToken.deleteOne();


    return res.status(200).json({ message: "Senha redefinida com sucesso!" });
});

// trocar de senha >> O usuario esta logado e quer mudar a senha
export const MudarSenha = asyncHandler (async (req, res) => {
    const {currentPassword, newPassword} = req.body;
    
    if(!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Todos os campos devem ser preenchidos!" });
    }
    if(currentPassword === newPassword) {
        return res.status(400).json({ message: "A nova senha deve ser diferente da senha atual!" });
    }
    if (newPassword.length < 8) { // Define o mínimo de caracteres
        return res.status(400).json({ message: "A senha deve ter pelo menos 8 caracteres!" });
    }

    // encontrar o usuario pelo Id
    const user = await User.findById(req.user._id);

    // comparar para ver se a senha atual é a mesma que a senha no banco de dados
    const passwordIsCorrect = await bcrypt.compare(currentPassword, user.password);

    if(!passwordIsCorrect) {
        return res.status(400).json({ message: "Senha atual incorreta!" });
    }

    // se a senha for a mesma trocar pela senha digitada
    if(passwordIsCorrect){
        user.password = newPassword;
        await user.save();
        return res.status(200).json({ message: "Senha alterada com sucesso!" });
    }else{
        return res.status(400).json({ message: "Algo deu errado, por favor tente novamente!" });
    }



    
});

export const ValidarToken = async (req, res) => {
    const { senhatoken } = req.params;
    try {
      // Hash do token recebido
      const hashedToken = hashToken(senhatoken);
      // Verifique se o token existe no banco de dados
      const tokenValido = await Token.findOne({ passwordResetToken: hashedToken });
  
      if (!tokenValido) {
        return res.status(400).json({ valid: false, message: "Token inválido ou expirado" });
      }
  
      // Verifique se o token expirou
      const agora = new Date();
      if (tokenValido.expireAt < agora) {
        return res.status(400).json({ valid: false, message: "Token expirado" });
      }
  
      // Token é válido
      return res.status(200).json({ valid: true });
    } catch (error) {
      console.error("Erro ao validar o token:", error);
      return res.status(500).json({ valid: false, message: "Erro no servidor" });
    }
  };