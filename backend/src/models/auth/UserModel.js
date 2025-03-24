import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
        default: "https://p1.hiclipart.com/preview/227/359/624/education-icon-avatar-student-share-icon-user-user-profile-education-purple-png-clipart.jpg",
        },

    bio: {
        type: String,
        default: "Digite uma biografia",
        },
    role: {
        type: String,
        enum: ["user", "admin", "adminSupremo"],
        default: "user",
        },
    isverified: {
        type: Boolean,
        default: false,
        },
    },  
    {timestamps: true, minimize: true}
);

// hash a senha antes de salvar no banco de dados

UserSchema.pre("save", async function(next){
    // checar se a senha foi modificada
    if (!this.isModified("password")){
        return next();
    }
    // hash a senha usando bcrypt
    // gerar um salt
    const salt = await bcrypt.genSalt(10);
    // gerar a senha hash
    const senhaHash = this.password = await bcrypt.hash(this.password, salt);

    // substituir a senha pela senha hash
    this.password = senhaHash;
    next();
});

const User = mongoose.model("User", UserSchema);


export default User;