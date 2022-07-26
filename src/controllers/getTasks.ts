import { Request, Response } from 'express'
import { response } from '../util/helpers'
//@ts-ignore
import { getTasksInDatabase } from '../database/databaseServices'
import logger from "../util/logger"

const getTasks = async (req: Request, res: Response): Promise<Response> => {

    const { userid } = req?.headers || {};

    if (!userid || typeof userid != 'string') return response(400, "Usuário não enviado.", true, {}, res);

    const tasks = await getTasksInDatabase(userid)

    if (!tasks) return response(500, "Falha ao recuperar as tarefas. Contate o suporte", true, { userid }, res);

    return response(200, "Tarefas enviadas com sucesso.", false, tasks, res);
}

export default getTasks