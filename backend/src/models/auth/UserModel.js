import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Digite um nome"],
        },

    email:{
        type: String,
        required: [true, "Digite um email"],
        unique: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Digite um email válido"],
        },
    password: {
        type : String,
        required: [true, "Digite uma senha"],
        },
    photo: {
        type: String,
        default: "https://camo.githubusercontent.com/e7260310f5d1a8a9473a908e039f348a459078b0ba1876d12fbe0a26c8a0e1a7/68747470733a2f2f7a7562652e696f2f66696c65732f706f722d756d612d626f612d63617573612f33363664616462316461323032353338616531333332396261333464393030362d696d6167652e706e67",
        },

    bio: {
        type: String,
        default: "Digite uma biografia",
        },
    role: {
        type: String,
        enum: ["user", "admin", "root"],
        default: "user",
        },
    isverified: {
        type: Boolean,
        default: false,
        },
    },  
    {timestamps: true, minimize: true}
);

const User = mongoose.model("User", UserSchema);


export default User;