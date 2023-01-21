import { checkUserEmailPassword, oAuthToDbUser } from './../../../database';
import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"

declare module "next-auth" {
    interface Session {
        accessToken?: string;
    }
}


export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [

        Credentials({
            name: "Custom login",
            credentials: {
                email: { label: "Correo", type: "email", placeholder: "correo@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // en este punto se validan las credenciales en la BD y se retorna el usuario
                const user = await checkUserEmailPassword(credentials!.email, credentials!.password)

                // si no se encuentra el user, enviamo null para que la autenticacion falle
                if (!user) return null

                // si se encuentra el user, lo retornamos (hay que comvertir el atrbuto _id a id)
                const { _id, email, name, role } = user
                return { id: _id, email, name, role }
            }
        }),

        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),


    ],

    // custom pages
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register'
    },

    jwt: {

    },

    session:{
        maxAge: 2592000,
        strategy: 'jwt',
        updateAge: 86400
    },


    callbacks: {

        // en este paso capturamos el token y le añadimos un payload con los datos del usuario que validamos en la BD
        async jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token
                switch (account.type) {
                    case 'oauth':
                        // el usuario se logueo por un proveeedor, debemos crearlo o revisar si existe en la BD
                        const { _id, email, name, role } = await oAuthToDbUser(user?.email || '', user?.name || '')
                        token.user = { id: _id, email, name, role }
                        break;

                    case 'credentials':
                        // el usuario se logueo por nuestro login, le agregamos la propiedad user al token
                        token.user = user
                        break;
                }
            }

            return token
        },

        async session({ session, token, user }) {
            // remplazamos el usuario que viene en la session, por el nuestro usuario personalizado
            session.accessToken = token.accessToken as any
            session.user = token.user as any

            return session
        }
    }
}



export default NextAuth(authOptions)