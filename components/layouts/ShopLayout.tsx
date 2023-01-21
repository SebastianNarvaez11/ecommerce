import { ReactNode, FC, useEffect } from 'react'
import Head from 'next/head'
import { Navbar, SideMenu } from '../ui'
import { Box } from '@mui/material'



interface Props {
    title: string,
    page_description: string,
    image_url?: string
    children: ReactNode
}

export const ShopLayout: FC<Props> = ({ children, title, page_description, image_url }) => {

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={page_description} />

                <meta name="og:title" content={title} />
                <meta name="og:description" content={page_description} />

                {image_url && (<meta name="og:image" content={image_url} />)}
            </Head>

            <SideMenu />
            <Navbar />

            <Box sx={{ margin: '80px auto', paddingLeft: { xs: '15px', sm: '60px' }, paddingRight: { xs: '10px', sm: '60px' }, maxWidth: '1440px' }}>
                {children}
            </Box>

            <footer>
                {/* TODO: FOOTER */}
            </footer>
        </>
    )
}
