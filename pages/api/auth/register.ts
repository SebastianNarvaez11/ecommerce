import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';
import { db } from '../../../database'
import { UserModel } from '../../../models'
import { jwt, isValidEmail } from '../../../utils';

type Data =
    | { message: string }
    | {
        token: string,
        user: {
            email: string,
            role: string,
            name: string
        }
    }


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return registerUser(req, res)

        default:
            return res.status(400).json({ message: 'Este endpoint no existe' })
    }
}




const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string }

    // validamos caractere de contraseña
    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe ser mayor a 6 caracteres' })
    }

    // validamos caracteres de el name
    if (name.length < 2) {
        return res.status(400).json({ message: 'El nombre debe ser mayor a 2 caracteres' })
    }

    // validamos el email
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'El correo no tiene el formato correcto' })
    }

    // buscamos si existe un usuario con ese correo
    await db.connect()
    const user = await UserModel.findOne({ email })

    if (user) {
        await db.disconnect()
        return res.status(400).json({ message: 'Ya existe una cuenta registrada con ese correo' })
    }

    // si no existe el usuario, entonces lo creamos
    const newUser = new UserModel({
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name
    })

    // guardamos el user en la bd
    try {
        await newUser.save({ validateBeforeSave: true })
    } catch (error) {
        return res.status(500).json({ message: 'Revisar los logs del servidor' })
    }

    const { _id, role } = newUser

    const token = jwt.signToken(_id, email)

    return res.status(200).json({
        token,
        user: {
            email, role, name
        }
    })
}