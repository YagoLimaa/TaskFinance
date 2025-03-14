import jwt from 'jsonwebtoken';

// Função para gerar token com o id do usuario
// token precisa voltar pro cliente
const gerarToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

export default gerarToken;