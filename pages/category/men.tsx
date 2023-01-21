import { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { useProducts } from '../../hooks'
import { Typography } from '@mui/material'
import { FullScreenLoading } from '../../components/ui'
import { ListProducts } from '../../components/products'

const MenPage: NextPage = () => {

    const { products, isLoading } = useProducts('/products?gender=men')
    
    return (
        <ShopLayout title='Hombres' page_description='Articulos para hombres'>
            <Typography variant='h1' component='h1'>Hombres</Typography>

            {isLoading
                ? <FullScreenLoading />
                : <ListProducts products={products} />
            }

        </ShopLayout>
    )
}

export default MenPage