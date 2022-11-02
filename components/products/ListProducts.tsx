import { FC } from "react"
import { Grid } from "@mui/material"
import { IProduct } from "../../interfaces/products"
import { ProductCard } from "./ProductCard"

interface Props {
    products: IProduct[]
}

export const ListProducts: FC<Props> = ({ products }) => {
    return (
        <Grid container spacing={5} marginTop={2}>
            {products.map(product => (
                <ProductCard key={product._id} product={product}/>
            ))}
        </Grid>
    )
}
