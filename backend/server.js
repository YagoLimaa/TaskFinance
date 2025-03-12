import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./src/db/connect.js";
import cookieParser from "cookie-parser";

import fs from "node:fs";

dotenv.config();

const port = process.env.PORT || 8000; 
const app = express();

//middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


//rotas
const routeFiles = fs.readdirSync("./src/routes");

routeFiles.forEach((file)=>{
    //fazendo import pelo dynamic
    import(`./src/routes/${file}`).then((route) => {
    app.use("/api/v1", route.default);
    }).catch((error) => {
        console.log("erro ao importar rotas", error.message);
    });
});


const server = async () =>{
    try {

        await connect();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            });
    } catch (error) {
        console.log("não deu pra iniciar o servidor ", error.message);
        process.exit(1);
    }
};

server();