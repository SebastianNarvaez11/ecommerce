import type { NextPage } from 'next'
import { Typography } from '@mui/material'

import { ShopLayout } from '../components/layouts'
import { ListProducts } from '../components/products'
import { useProducts } from '../hooks'
import { FullScreenLoading } from '../components/ui'


const HomePage: NextPage = () => {

  const { products, isLoading } = useProducts('/products')

  return (
    <ShopLayout title='Ecommerce - Inicio' page_description='Esta es la descripcion de la tienda'>
      <Typography variant='h1' component='h1'>Tienda</Typography>

      {isLoading
        ? <FullScreenLoading/>
        : <ListProducts products={products} />
      }

    </ShopLayout>
  )
}

export default HomePage
