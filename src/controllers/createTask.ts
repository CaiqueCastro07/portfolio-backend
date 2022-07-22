import { Request, Response } from 'express'
import { response } from '../helpers/helpers'
//@ts-ignore
import { reverseJoinDate } from '../helpers/helpers'
import { } from '../dto/objects/ObjectTypes'
import { createTaskInDatabase } from '../database/databaseServices'
import logger from "../../config/winston"

const createTask = async (req: Request, res: Response): Promise<Response> => {

    //@ts-ignore
    const { newtask }: string = req?.body, { userid }: string = req?.headers

    if (!newtask || typeof newtask != 'string') return response(400, "Erro ao criar tarefa, verifique os valores enviados.", true, {}, res);
    if (!userid || typeof userid != 'string') return response(400, "Erro ao criar tarefa, usuário não enviado.", true, {}, res);

    const taskCreated = await createTaskInDatabase(newtask,userid)

    if (!taskCreated) return response(500, "Erro ao criar tarefa. Contate o suporte.", true, {}, res);

    return response(200, "Tarefa adicionada com sucesso.", false, {}, res);
}

export default createTask