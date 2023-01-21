import { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { useProducts } from '../../hooks'
import { Typography } from '@mui/material'
import { FullScreenLoading } from '../../components/ui'
import { ListProducts } from '../../components/products'

const WomenPage: NextPage = () => {

    const { products, isLoading } = useProducts('/products?gender=women')
    
    return (
        <ShopLayout title='Mujeres' page_description='Articulos para mujeres'>
            <Typography variant='h1' component='h1'>Mujeres</Typography>

            {isLoading
                ? <FullScreenLoading />
                : <ListProducts products={products} />
            }

        </ShopLayout>
    )
}

export default WomenPage