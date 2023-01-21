import bcrypt from 'bcryptjs';
import { db } from "."
import { UserModel } from "../models"

export const checkUserEmailPassword = async (email: string, password: string) => {

    await db.connect()
    const user = await UserModel.findOne({ email }).lean()
    await db.disconnect()

    if (!user) {
        return null
    }

    if (!bcrypt.compareSync(password, user.password!)) {
        return null
    }

    const { role, name, _id } = user

    return {
        _id,
        email,
        role,
        name
    }
}


export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {

    await db.connect()
    const user = await UserModel.findOne({ email: oAuthEmail })

    // si existe el suaurio con ese correo, lo devolvemos
    if (user) {
        await db.disconnect()
        const { _id, name, email, role } = user
        return { _id, name, email, role }
    }

    // si no existe, entonces lo creamos en la BD
    const newUser = new UserModel({email: oAuthEmail, name: oAuthName, password:'@', role: 'client'})
    await newUser.save()
    await db.disconnect()

    const { _id, name, email, role } = newUser
    return { _id, name, email, role }
}