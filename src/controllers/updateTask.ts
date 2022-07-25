import { Request, Response } from 'express'
import { response } from '../helpers/helpers'
//@ts-ignore
import { reverseJoinDate } from '../helpers/helpers'
import { } from '../dto/objects/ObjectTypes'
import { updateTaskInDatabase } from '../database/databaseServices'

const updateTask = async (req: Request, res: Response): Promise<Response> => {
    //@ts-ignore
    const { id }:string = req?.params || {}, { val }:string = req?.body || {}, { userid }:string = req?.headers || {}

    if (!id || typeof id != 'string') return response(400, "Erro ao atualizar tarefa, ID não enviado.", true, {}, res);
    if (typeof val != 'boolean' && typeof val != 'string') return response(400, "Erro ao atualizar tarefa, tipo do valor não permitido.", true, {}, res);
    if (!userid || typeof userid != 'string') return response(400, "Erro ao atualizar tarefa, usuário não enviado.", true, {}, res);

    const updateTaskResult = await updateTaskInDatabase(id, userid, val)

    if (!updateTaskResult) return response(500, "Houve um erro ao atualizar a tarefa. Contate o suporte.", false, {}, res);

    return response(200, "Tarefa atualizada com sucesso.", false, { status: 200 }, res);
}

export default updateTask