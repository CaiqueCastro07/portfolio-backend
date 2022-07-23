import { Request, Response } from 'express'
import { response } from '../helpers/helpers'
//@ts-ignore
import { reverseJoinDate } from '../helpers/helpers'
import { } from '../dto/objects/ObjectTypes'
import { createUserInDatabase } from '../database/databaseServices'
import logger from "../../config/winston"

const registerUser = async (req: Request, res: Response): Promise<Response> => {

    //@ts-ignore
    const { user, password,email }: string = req?.body || {}

    if (!user || typeof user != 'string') return response(400, "Usuário não enviado.", true, {}, res);
    if (!password || typeof password != 'string') return response(400, "Senha não enviada.", true, {}, res);
    if (!email || typeof email != 'string') return response(400, "Email não enviado.", true, {}, res);

    const userCreated = await createUserInDatabase(user,email,password)
    //@ts-ignore
    if (userCreated?.error) return response(400, "Erro ao registrar usuário.", true, userCreated?.error , res);

    return response(200, "Usuário registrado com sucesso.", false, user, res);
}

export default registerUser