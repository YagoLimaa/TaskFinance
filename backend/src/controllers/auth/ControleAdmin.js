import asyncHandler from 'express-async-handler';
import User from '../../models/auth/UserModel.js';

// Deletar um usuário pelo ID
export const deleteUsuario = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        return res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao deletar usuário" });
    }
});

// Pegar todos os usuários
export const getUsuarios = asyncHandler(async (req, res) => {
    try {
        // Busca todos os usuários, excluindo o campo "senha"
        const users = await User.find({}).select("-senha");
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "Nenhum usuário encontrado" });
        }
        return res.status(200).json(users);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ message: "Erro ao buscar usuários" });
    }
});