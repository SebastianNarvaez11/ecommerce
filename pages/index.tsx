import type { NextPage } from 'next'
import { Box, Typography } from '@mui/material'

import { ShopLayout } from '../components/layouts'
import { categoriesData, productsData } from '../json'
import { CategoryCard, ListProducts } from '../components/products'

const Home: NextPage = () => {
  return (
    <ShopLayout title='Ecommerce - Inicio' page_description='Esta es la descripcion de la tienda'>
      <Typography variant='h1' component='h1'>Tienda</Typography>

      <Box marginTop={5}>
        <Typography color="text.secondary" variant='h2' component='h2' marginBottom={1}>Categorias:</Typography>
        <Box className='style_scrooll' style={{ overflowX: 'auto', overflowY: 'auto', whiteSpace: 'nowrap', padding: 10 }}>
          {categoriesData.map(category => (
            <CategoryCard key={category.name} name={category.name} img={category.img} />
          ))}
        </Box>
      </Box>


      <ListProducts products={productsData}/>


    </ShopLayout>
  )
}

export default Home
