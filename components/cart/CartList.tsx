import { Box, Button, CardActionArea, CardMedia, Grid, Typography } from '@mui/material'
import { initialData } from '../../database/seed-data'
import Link from 'next/link'
import { borderRadius } from '@mui/system'
import { ItemCounter } from '../ui'
import { FC } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { ICartProduct, IOrderItem } from '../../interfaces'
import { remove_producto_in_cart, update_producto_in_cart } from '../../store/slices/cartSlice'


interface Props {
    editable?: boolean,
    products? : IOrderItem[]
}

export const CartList: FC<Props> = ({ editable = false, products }) => {

    const { cart } = useAppSelector(state => state.cart)
    const dispatch = useAppDispatch()

    const onUpdateQuantity = (product : ICartProduct, new_quantity: number) => {
        product = {...product, quantity : new_quantity}
        dispatch(update_producto_in_cart(product))
    }


    const productsToShow = products ? products : cart;

    return (
        <>
            {productsToShow.map(product => (
                <Grid container spacing={2} key={product.slug + product.size} sx={{ md: 1, mt: 1 }}>
                    <Grid item xs={3}>
                        <Link href={`/product/${product.slug}`}>
                                <CardActionArea>
                                    <CardMedia
                                        image={product.image}
                                        component='img'
                                        sx={{ borderRadius: '5px' }}
                                    />
                                </CardActionArea>
                        </Link>
                    </Grid>
                    <Grid item xs={7}>
                        <Box display='flex' flexDirection='column'>
                            <Typography variant='body1'>{product.title}</Typography>
                            <Typography variant='body1'>Talla: <strong>{product.size}</strong></Typography>

                            {editable ?
                                <ItemCounter currentValue={product.quantity} maxValue={5} onUpdateQuantity={(quantity) => onUpdateQuantity(product as ICartProduct, quantity)}/>
                                :
                                <Typography>{product.quantity} items</Typography>
                            }

                        </Box>
                    </Grid>
                    <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                        <Typography variant='subtitle1'> {`$${product.price}`}</Typography>

                        {editable && <Button variant='text' color='secondary' onClick={() => dispatch(remove_producto_in_cart(product as ICartProduct))}>Remover</Button>}

                    </Grid>
                </Grid>
            ))}
        </>
    )
}
