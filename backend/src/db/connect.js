import mongoose from 'mongoose';

const connect = async () => {
    try{
        console.log("tentando conectar ao banco de dados...");
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("Conectado ao banco de dados com sucesso!");
    }catch (error){
        console.log("Erro ao conectar ao banco de dados: ", error.message);
        process.exit(1);
        
    }
    
};
export default connect;