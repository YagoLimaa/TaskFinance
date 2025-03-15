import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Digite um título"],
        unique: true,
    },

    description: {
        type: String,
        default: [true, "Digite uma descrição"],
    },

    dueDate: {
        type: Date,
        default: Date.now(),
    },
    
    status: {
        type: String,
        enum: ["Pendente", "Em andamento", "Concluída", "Inativa"],
        default: "Inativa",
    },

    completed: {
        type: Boolean,
        default: false,
    },

    priority: {
        type: String,
        enum: ["Baixa", "Média", "Alta", "Urgente"],
        default: "Baixa",
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},
{timestamps: true} // sempre que uma Task for criada ele vai criar um createdAt e um updatedAt na hora exata
);


const TaskModel = mongoose.model("Task", TaskSchema);

export default TaskModel;
