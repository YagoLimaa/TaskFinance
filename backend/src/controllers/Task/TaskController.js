import asyncHandler from "express-async-handler";
import TaskModel from "../../models/Task/TaskModel.js";





export const CriarTarefa = asyncHandler(async (req, res) => {

    try {
        const { title, description, dueDate, status, priority } = req.body;

        if (!title || title.trim() === "") {
            res.status(400).json({ message: "Digite um título" });
        }
        if (!description || description.trim() === "") {
            res.status(400).json({ message: "Digite uma descrição" });
        }

        const tarefa = new TaskModel({
            title,
            description,
            dueDate,
            status,
            priority,
            user: req.user.id,
        });

        await tarefa.save();
        res.status(201).json(tarefa);

    } catch (error) {

        console.log("Erro ao criar tarefa: ", error.message);
        res.status(500).json({ message: error.message});
    }
    
});

export const ListarTarefas = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        if(!userId){
            res.status(404).json({ message: "Usuário não encontrado." });
        }

        const tarefas = await TaskModel.find({ user: userId });

        res.status(200).json(
        {  
            total: tarefas.length,
            tarefas,
        });



    } catch (error) {

        console.log("Erro ao criar tarefa: ", error.message);
        res.status(500).json({ message: error.message});
        
    }
});

export const PegarTarefa = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const {idTarefa} = req.params;

        if (!idTarefa){
            res.status(400).json({ message: "Tarefa não encontrada." });
        }

        const tarefas = await TaskModel.findById(idTarefa);

        if (!tarefas){
            res.status(404).json({ message: "Tarefa não encontrada." });
        }

        if(!tarefas.user.equals(userId)){
            res.status(401).json({ message: "Acesso não autorizado." });
        }
        res.status(200).json(tarefas);
    } catch (error) {
        console.log("Erro ao pegar a tarefa: ", error.message);
        
    }
});

export const AtualizarTarefa = asyncHandler(async (req, res) => {
    try {

        const userId = req.user.id;
        const {idTarefa} = req.params;
        const {title, description, dueDate, status, completed, priority} = req.body;

        if (!idTarefa){
            res.status(400).json({ message: "Tarefa não encontrada." });
        }

        const tarefa = await TaskModel.findById(idTarefa);
        if (!tarefa){
            res.status(404).json({ message: "Tarefa não encontrada." });
        }

        if(!tarefa.user.equals(userId)){
            res.status(401).json({ message: "Acesso não autorizado." });
        }

         // Verificando se o título fornecido já existe
         if (title) {
            const tituloExistente = await TaskModel.findOne({ title });

            if (tituloExistente && tituloExistente._id.toString() !== idTarefa) {
                return res.status(400).json({ message: "O título já está em uso." });
            }
        }
        
        tarefa.title = title || tarefa.title;
        tarefa.description = description || tarefa.description;
        tarefa.dueDate = dueDate || tarefa.dueDate;
        tarefa.status = status || tarefa.status;
        tarefa.completed = completed || tarefa.completed;
        tarefa.priority = priority || tarefa.priority;

        await tarefa.save();
        return res.status(200).json(tarefa);

    } catch (error) {
        console.log("Erro ao atualizar a tarefa: ", error.message);
        res.status(500).json({ message: "Erro ao atualizar a tarefa." })
    }
});

export const ApagarTarefa = asyncHandler(async (req, res) => {
    try {

        const userId = req.user.id;
        const {idTarefa} = req.params;
        const tarefa = await TaskModel.findById(idTarefa);

        if(!idTarefa){
            res.status(400).json({ message: "Tarefa não encontrada." });
        }
        
        if (!tarefa.user.equals(userId)){
            res.status(401).json({ message: "Acesso não autorizado." });
        }

        await TaskModel.findByIdAndDelete(idTarefa);
        
        return res.status(200).json({ message: "Tarefa apagada com sucesso." });

    } catch (error) {
        console.log("Erro ao apagar a tarefa: ", error.message);
        res.status(500).json({ message: "Erro ao apagar a tarefa." })
    }
        
});

