// erros do middleware

const errosMidleware = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }


    // status de codigo

    const codigoDeStatus = res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;

    res.status(codigoDeStatus);


    // logs de erro no console se nao for de producao para poder fazer debugging
    if(process.env.NODE_ENV !== "production"){
        console.log(err);
    }

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

export default errosMidleware;