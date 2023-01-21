import { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { useProducts } from '../../hooks'
import { Typography } from '@mui/material'
import { FullScreenLoading } from '../../components/ui'
import { ListProducts } from '../../components/products'

const KidPage: NextPage = () => {

    const { products, isLoading } = useProducts('/products?gender=kid')
    
    return (
        <ShopLayout title='Niños' page_description='Articulos para niños'>
            <Typography variant='h1' component='h1'>Niños</Typography>

            {isLoading
                ? <FullScreenLoading />
                : <ListProducts products={products} />
            }

        </ShopLayout>
    )
}

export default KidPage