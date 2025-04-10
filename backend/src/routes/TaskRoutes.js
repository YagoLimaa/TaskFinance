import express from "express";
import { ApagarTarefa, AtualizarTarefa, CriarTarefa, ListarTarefas, PegarTarefa } from "../controllers/Task/TaskController.js";
import {protect} from "../middleware/authMiddleware.js";


const router = express.Router();
// [protect] se refere ao middleware que vai proteger a rota, ou seja, só vai deixar acessar a rota se o usuário estiver logado

// rota para poder criar tarefas novas
router.post("/tarefa/criar", protect, CriarTarefa);

// rota para poder listar as tarefas do usuário logado
router.get("/tarefa/listar", protect, ListarTarefas);

// rota para poder pegar uma tarefa específica pelo [Id] da tarefa armazenada no banco de dados
router.get("/tarefa/:idTarefa", protect, PegarTarefa);

// rota para poder atualizar a tarefa buscando pelo id
router.patch("/tarefa/atualizar/:idTarefa", protect, AtualizarTarefa);

// rota para poder apagar a tarefa buscando pelo id
router.delete("/tarefa/apagar/:idTarefa", protect, ApagarTarefa);

export default router;