import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { UserModel } from '../../../models'
import { jwt } from '../../../utils';
import { IResponseLogin } from '../../../interfaces';

type Data =
    | { message: string }
    | IResponseLogin


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return loginUser(req, res)

        default:
            return res.status(400).json({ message: 'Este endpoint no existe' })
    }
}


const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { email = '', password = '' } = req.body

    await db.connect()
    const user = await UserModel.findOne({ email })
    await db.disconnect()

    if (!user) {
        return res.status(400).json({ message: 'Email o contraseña incorrectos - Email' })
    }

    if (!bcrypt.compareSync(password, user.password!)) {
        return res.status(400).json({ message: 'Email o contraseña incorrectos - Contraseña' })
    }

    const { role, name } = user

    const token = jwt.signToken(user._id, email)

    return res.status(200).json({
        token,
        user: {
            email, role, name
        }
    })
}