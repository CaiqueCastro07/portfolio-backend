import { Request, Response } from 'express'
import { response } from '../helpers/helpers'
//@ts-ignore
import { verifyUserCredentials } from '../database/databaseServices'

const login = async (req: Request, res: Response): Promise<Response> => {
    //@ts-ignore
    const { user, password }: string = req?.body || {}

    if (!user || typeof user != 'string') return response(400, "User not sent", true, {}, res);
    if (!password || typeof password != 'string') return response(400, "Password not sent", true, {}, res);

    const authorized = await verifyUserCredentials(user, password)
    //@ts-ignore
    if (authorized?.error) return response(400, authorized?.error, true, authorized?.error, res);

    return response(200, "User authorized", false, user?.toLowerCase(), res);
}

export default login