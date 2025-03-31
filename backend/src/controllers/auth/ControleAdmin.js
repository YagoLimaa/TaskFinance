import asyncHandler from 'express-async-handler';
import User from '../../models/auth/UserModel.js';

export const deleteUsuario = asyncHandler(async (req, res) => {
    const {id} = req.params;

    // tentativa de deletar usuário
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user){
            return res.status(404).json({message: "Usuário não encontrado"});
        }
        return res.status(200).json({message: "Usuário deletado com sucesso"});
    } catch (error) {
        return res.status(500).json({message: "Erro ao deletar usuário"});
    }
});

// pegar todos os usuarios
export const getUsuarios = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({});
        if (!users){
            return res.status(404).json({message: "Usuários não encontrados"});
        }
        return res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: "Erro ao pegar usuários"});
    }
});