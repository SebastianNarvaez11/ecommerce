import { useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Button, Card, CardContent, Divider, Grid, Typography, Box } from '@mui/material'

import { ShopLayout } from '../../components/layouts'
import { CartList, OrderSummary } from '../../components/cart'
import { useAppSelector } from '../../store/hooks'



const CartPage: NextPage = () => {

    const router = useRouter()
    const { cart, isLoaded } = useAppSelector(state => state.cart)

    useEffect(() => {
        if(isLoaded && cart.length === 0){
            router.replace('/cart/empty')
        }
    }, [isLoaded, cart, router])


    if(!isLoaded || cart.length === 0){
        return <></>
    }
    
    return (
        <ShopLayout title='Carrito de compras' page_description='carrito de compras de la tienda'>
            <Typography variant='h1' component='h1'>Carrito</Typography>

            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList editable />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Orden</Typography>
                            <Divider sx={{ my: 1 }} />

                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                <Button color='secondary' className='circular-btn' fullWidth href='/checkout/address'>
                                    Checkout
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </ShopLayout>
    )
}

export default CartPage