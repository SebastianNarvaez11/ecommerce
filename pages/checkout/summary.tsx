import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Box, Button, Card, CardContent, Divider, Grid, Typography, Chip } from '@mui/material';

import { ShopLayout } from '../../components/layouts/ShopLayout';
import { CartList, OrderSummary } from '../../components/cart';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Cookies from 'js-cookie';
import { createOrder } from '../../store/thunks';


const SummaryPage: NextPage = () => {

    const router = useRouter();
    const dispatch = useAppDispatch()

    const { shippingAddress } = useAppSelector(state => state.cart)

    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // efecto para que el usuario sea redirigido a la pagina del address si no se encuentra la informacion en la cookies
    useEffect(() => {
        if (!Cookies.get('firstName')) {
            router.push('/checkout/address');
        }
    }, [router]);



    const onCreateOrder = async () => {
        setIsPosting(true)

        const { hasError, message } = await dispatch(createOrder())
        if (hasError) {
            setIsPosting(false)
            setErrorMessage(message!)
            return
        }

        // si no hay error, en el message viene el _id
        router.replace(`/orders/${message}`)
    }



    if (!shippingAddress) {
        return <></>;
    }

    return (
        <ShopLayout title='Resumen de orden' page_description={'Resumen de la orden'}>
            <Typography variant='h1' component='h1'>Resumen de la orden</Typography>

            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen (3 productos)</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <Link href='/checkout/address'>
                                    Editar
                                </Link>
                            </Box>


                            <Typography>{shippingAddress?.firstName} {shippingAddress?.lastName}</Typography>
                            <Typography>{shippingAddress?.city}</Typography>
                            <Typography>{shippingAddress?.address}</Typography>
                            <Typography>{shippingAddress?.country}</Typography>
                            <Typography>{shippingAddress?.phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='end'>
                                <Link href='/cart'>
                                    Editar
                                </Link>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                <Button
                                    color="secondary"
                                    className='circular-btn'
                                    fullWidth
                                    onClick={onCreateOrder}
                                    disabled={isPosting}
                                >
                                    Confirmar Orden
                                </Button>


                                <Chip
                                    color="error"
                                    label={errorMessage}
                                    sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                                />
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


        </ShopLayout>
    )
}

export default SummaryPage;