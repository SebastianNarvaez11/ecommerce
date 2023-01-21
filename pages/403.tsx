import { NextPage } from "next"

import { Typography, Box } from "@mui/material"
import { ShopLayout } from "../components/layouts"

const Page404: NextPage = () => {
    return (
        <ShopLayout title="No autorizado" page_description="no estas autorizado">
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                height={'calc(100vh - 200px)'}
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                <Typography variant="h1" component='h1' fontSize={60} fontWeight={200}>403 |</Typography>
                <Typography marginLeft={2}>No tienes permisos para acceder a la pagina solicitada</Typography>
            </Box>
        </ShopLayout>
    )
}

export default Page404