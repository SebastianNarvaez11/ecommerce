import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

import { useState } from 'react'

import { Box, Button, Chip, Grid, Typography } from '@mui/material'
import { ShopLayout } from '../../components/layouts'
import { ItemCounter } from '../../components/ui'
import { SizeSelector, ProductSlidesshow } from '../../components/products'
import { getAllProductsSlugs, getProductBySlug } from '../../database/dbProducts'
import { IProduct, ISize } from '../../interfaces'
import { ICartProduct } from '../../interfaces/cart'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { add_product_to_cart } from '../../store/slices/cartSlice'

interface Props {
    product: IProduct
}

const ProductPage: NextPage<Props> = ({ product }) => {

    const router = useRouter()
    const dispatch = useAppDispatch()

    const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
        _id: product._id,
        image: product.images[0],
        price: product.price,
        size: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        quantity: 1
    })

    const onSelectedSize = (size: ISize) => {
        setTempCartProduct({ ...tempCartProduct, size })
    }

    const onUpdateQuantity = (quantity: number) => {
        setTempCartProduct({ ...tempCartProduct, quantity })
    }

    const onAddProduct = () => {
        if (!tempCartProduct.size) return

        dispatch(add_product_to_cart(tempCartProduct))
        router.push('/cart')
    }


    return (
        <ShopLayout title='titulo del producto' page_description='descripcion del producto'>
            <Grid container style={{ marginTop: 150 }}>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <Typography textTransform='uppercase' color="text.secondary" fontSize={15} marginBottom={3}>CATEGORIA</Typography>
                    <Typography variant='h1' component='h1'>{product.title}</Typography>
                    <Typography variant='body2' color="text.secondary" marginTop={4}>
                        Introducing the Tesla Chill Collection. The Men’s Chill Crew Neck Sweatshirt has a premium, heavyweight exterior
                        and soft fleece interior for comfort in any season. The sweatshirt features a subtle thermoplastic polyurethane
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={12} md={4} lg={4} padding={3}>
                    <ProductSlidesshow images={product.images} />
                </Grid>

                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <Box display='flex' justifyContent='space-between' sx={{ marginTop: { xs: 2, lg: 0 } }}>
                        <Typography textTransform='uppercase' color="text.secondary">Precio</Typography>
                        <Typography variant='h2' component='h2' fontWeight={600}>{product.price} COP</Typography>
                    </Box>

                    <Typography textTransform='uppercase' color="text.secondary" marginTop={5}>Cantidad</Typography>

                    <ItemCounter currentValue={tempCartProduct.quantity} maxValue={product.inStock} onUpdateQuantity={onUpdateQuantity} />

                    <Typography textTransform='uppercase' color="text.secondary" marginTop={5}>Talla</Typography>

                    <SizeSelector sizes={product.sizes} selectedSize={tempCartProduct.size} onSelectedSize={onSelectedSize} />

                    {product.inStock > 0
                        ?
                        <Button color='secondary' className='circular-btn' fullWidth onClick={onAddProduct}>
                            {tempCartProduct.size ? 'Agregar al carrito' : 'Seleccione una talla'}
                        </Button>
                        :
                        <Chip color='error' label='No hay disponibles' variant='outlined' sx={{ width: '100%' }} />
                    }

                </Grid>
            </Grid>
        </ShopLayout>
    )
}



export const getStaticPaths: GetStaticPaths = async (ctx) => {

    const products = await getAllProductsSlugs()

    return {
        paths: products.map(product => (
            {
                params: { slug: product.slug }
            }
        )),
        fallback: "blocking"
    }
}



export const getStaticProps: GetStaticProps = async ({ params }) => {

    const { slug = '' } = params as { slug: string }

    const product = await getProductBySlug(slug)

    if (!product) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            product
        },
        revalidate: 60 * 60 * 24
    }
}

export default ProductPage