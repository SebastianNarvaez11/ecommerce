import { NextPage } from 'next'
import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'
import { ShopLayout } from '../../components/layouts'
import ProductSlidesshow from '../../components/products/ProductSlidesshow'
import { productsData } from '../../json'
import { ItemCounter } from '../../components/ui'
import { SizeSelector } from '../../components/products'

const product = productsData[1]

const ProductPage: NextPage = () => {
    return (
        <ShopLayout title='titulo del producto' page_description='descripcion del producto'>
            <Grid container style={{ marginTop: 150 }}>
                <Grid item xs={12} sm={12} md={6} lg={3}>
                    <Typography textTransform='uppercase' color="text.secondary" fontSize={15} marginBottom={3}>CATEGORIA</Typography>
                    <Typography variant='h1' component='h1'>Titulo del Producto</Typography>
                    <Typography variant='body2' color="text.secondary" marginTop={4}>
                        Introducing the Tesla Chill Collection. The Men’s Chill Crew Neck Sweatshirt has a premium, heavyweight exterior
                        and soft fleece interior for comfort in any season. The sweatshirt features a subtle thermoplastic polyurethane
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} padding={3}>
                    <ProductSlidesshow images={product.images} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={3}>
                    <Box display='flex' justifyContent='space-between' sx={{ marginTop: { xs: 2, lg: 0 } }}>
                        <Typography textTransform='uppercase' color="text.secondary">Precio</Typography>
                        <Typography variant='h2' component='h2' fontWeight={600}>$ 200.000 COP</Typography>
                    </Box>
                    <Typography textTransform='uppercase' color="text.secondary" marginTop={5}>Cantidad</Typography>
                    <ItemCounter />
                    <Typography textTransform='uppercase' color="text.secondary" marginTop={5}>Talla</Typography>
                    <SizeSelector sizes={product.sizes}/>

                    <Button color='secondary' className='circular-btn' fullWidth>
                        Agregar al carrito
                    </Button>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default ProductPage