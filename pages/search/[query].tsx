import type { NextPage, GetServerSideProps } from 'next'
import { Typography } from '@mui/material'

import { ShopLayout } from '../../components/layouts'
import { ListProducts } from '../../components/products'
import { getAllProducts, getProductsByTerm } from '../../database/dbProducts'
import { IProduct } from '../../interfaces'

interface Props {
  products: IProduct[],
  foundProducts: boolean,
  query: string
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {

  return (
    <ShopLayout title='Busqueda' page_description='Pagina de busqueda'>
      <Typography variant='h1' component='h1'>Buscar</Typography>

      {foundProducts
        ? <Typography variant='h2' component='h1'>Resultados para: {query}</Typography>
        : <Typography variant='h2' component='h1'>No encontramos nada relacionado con: {query}</Typography>
      }

      {/* No necesitamos un loading mientras se cargan los productos, porque el componente
       se renderiza del lado del server ya con los productos previamente cargados*/}
      <ListProducts products={products} />

    </ShopLayout>
  )
}

export default SearchPage




export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const { query = '' } = params as { query: string }

  if (query.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true
      }
    }
  }

  let products = await getProductsByTerm(query)

  const foundProducts = products.length > 0

  if (!foundProducts) {
    products = await getAllProducts()
  }

  return {
    props: {
      products,
      foundProducts,
      query
    }
  }
}