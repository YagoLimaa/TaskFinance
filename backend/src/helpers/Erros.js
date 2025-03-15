// erros do middleware

const errosMidleware = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    // Definir status de erro
    let codigoDeStatus = res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;
    let mensagem = err.message || "Ocorreu um erro no servidor.";

    // Se for um erro de validação do Mongoose
    if (err.name === "ValidationError") {
        codigoDeStatus = 400;
        mensagem = Object.values(err.errors).map((e) => e.message); // Pega as mensagens dos erros
    }

    // Log do erro no console para debugging (exceto em produção)
    if (process.env.NODE_ENV !== "production") {
        console.log(err);
    }

    // Enviar resposta formatada como JSON
    res.status(codigoDeStatus).json({
        sucesso: false,
        mensagem,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
};

export default errosMidleware;
