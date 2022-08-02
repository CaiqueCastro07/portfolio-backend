import { Request, Response } from 'express'
import { decodePassword, response } from '../helpers/helpers'
//@ts-ignore
import { verifyUserCredentials } from '../database/databaseServices'

const login = async (req: Request, res: Response): Promise<Response> => {
    //@ts-ignore
    const { user, password, r }: string = req?.body || {}

    if (!user || typeof user != 'string') return response(400, "User not sent", true, {}, res);
    if (!password) return response(400, "Password not sent", true, {}, res);

    const decodedPass = decodePassword(password,r)

    const authorized = await verifyUserCredentials(user, decodedPass)
    //@ts-ignore
    if (authorized?.error) return response(400, authorized?.error, true, authorized?.error, res);

    return response(200, "User authorized", false, user?.toLowerCase(), res);
}

export default login