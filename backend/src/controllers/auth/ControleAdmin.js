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

// Verificar se o e-mail já está em uso
export const verificarEmail = asyncHandler(async (req, res) => {
    const { email } = req.query; // Recebe o e-mail da query string

    if (!email) {
        return res.status(400).json({ message: "E-mail não fornecido" });
    }

    // Verificar se o e-mail já está em uso
    const emailExists = await User.findOne({ email });

    if (emailExists) {
        return res.status(200).json({ exists: true });
    }

    return res.status(200).json({ exists: false });
});