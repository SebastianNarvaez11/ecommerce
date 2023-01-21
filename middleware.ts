import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {

    // optenemos la session
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })


    // para estas paginas el user debe estar logueado
    if (req.nextUrl.pathname.startsWith('/checkout')) {
        if (!session) {
            const requestedPage = req.nextUrl.pathname
            const url = req.nextUrl.clone()
            url.pathname = '/auth/login'
            url.search = `p=${requestedPage}`
            return NextResponse.redirect(url)
        }
    }


    // si se solicita las pagina de admin
    if (req.nextUrl.pathname.startsWith('/admin')) {

        // validamo que este logueado
        if (!session) {
            const requestedPage = req.nextUrl.pathname
            const url = req.nextUrl.clone()
            url.pathname = '/auth/login'
            url.search = `p=${requestedPage}`
            return NextResponse.redirect(url)
        }

        // validamos si tiene permisos
        if (session.user.role !== 'admin') {
            return NextResponse.rewrite(new URL('/403', req.url))
        }
    }


    // validaciones de la API y sus endpoins
    // estos se debenm evaluar de una forma diferente si accedemos desde otros host, ya que nexts auth no 
    // conoce la session de un tercero, se debe validar por el auth personalizado
    if (req.nextUrl.pathname.startsWith('/api/admin/')) {
        // validamo que este logueado
        if (!session) {
            return NextResponse.rewrite(new URL('/api/auth/unauthorized', req.url))
        }
        // validamos si tiene permisos
        if (session.user.role !== 'admin') {
            return NextResponse.rewrite(new URL('/api/auth/unauthorized', req.url))
        }
    }



    // si hay session entonces dejamos pasar
    return NextResponse.next()
}


// estas rutas son las que disparan el middleware:
export const config = {
    matcher: [
        '/checkout/:path*',
        '/admin/:path*',
        '/api/admin/:path*'
    ]
}