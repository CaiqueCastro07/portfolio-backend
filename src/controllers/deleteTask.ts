import { Request, Response } from 'express'
import { response } from '../util/helpers'
//@ts-ignore
import { deleteAllTasksByStatusInDatabase, deleteTaskInDatabase } from '../database/databaseServices'

const deleteTask = async (req: Request, res: Response): Promise<Response> => {
    //@ts-ignore
    const { id }: string = req?.params || {}, { userid }: string = req?.headers || {}

    if (!id || typeof id != 'string') return response(400, "Erro ao deletar tarefa, o id da tarefa não foi enviado", false, req?.params, res);
    if (!userid || typeof userid != 'string') return response(400, "Erro ao deletar tarefa, o usuario não foi enviado", false, { userid }, res);

    if (id === "done" || id === "todo") {

        const all = id == "done"

        const deleteAllResult = await deleteAllTasksByStatusInDatabase(all, userid)
        if (!deleteAllResult) return response(500, "Erro ao deletar todas as tarefas. Contate o suporte.", true, req?.params, res);
        return response(200, "Tarefas deletadas com sucesso", false, {}, res);

    }

    const deleteResult = await deleteTaskInDatabase(id, userid)

    if (!deleteResult) return response(500, "Erro ao deletar tarefa. Contate o suporte.", true, { userid, id }, res);

    return response(200, "Tarefa deletada com sucesso", false, {}, res);
}

export default deleteTask