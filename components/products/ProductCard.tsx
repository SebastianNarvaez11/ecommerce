import { FC, useState } from "react"
import { Box, Card, CardActionArea, CardMedia, Grid, IconButton, Link, Rating, Typography } from "@mui/material"
import StarIcon from '@mui/icons-material/StarOutlined';
import { IProduct } from "../../interfaces"
import { toMoney } from "../../utils"
import NextLink from "next/link";

interface Props {
    product: IProduct
}

export const ProductCard: FC<Props> = ({ product }) => {

    const [isHovered, setIsHovered] = useState(false)


    return (
        <Grid item xs={6} sm={6} md={4} lg={3}>
            <Card sx={{ height: '100%' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>

                <CardActionArea sx={{ padding: 1, height: '100%' }}>
                    {!isHovered ?
                        <NextLink href='/product/slug' passHref prefetch={false}>
                            <Link>
                                <CardMedia
                                    className="fadeIn"
                                    component='img'
                                    image={`img/products/${product.images[0]}`}
                                    alt={product.title}
                                    style={{ backgroundColor: '#F9F9F9', borderRadius: 20 }} />
                            </Link>
                        </NextLink>

                        :
                        <NextLink href='/product/slug' passHref prefetch={false}>
                            <Link>
                                <CardMedia
                                    className="fadeIn"
                                    component='img'
                                    image={`img/products/${product.images[1]}`}
                                    alt={product.title}
                                    style={{ backgroundColor: '#F9F9F9', borderRadius: 20 }} />
                            </Link>
                        </NextLink>
                    }

                    <Grid container marginTop={2}>
                        <Grid item xs={12} sm={8}>
                            <Typography fontWeight={500} fontSize={18}>{product.title}</Typography>
                            <Typography textTransform='uppercase' color="text.secondary" fontSize={12}>{product.category}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} display='flex' justifyContent='end'>
                            <StarIcon sx={{ color: '#FAAF00' }} />
                            <Typography textTransform='uppercase' color="text.secondary" fontSize={12} marginTop={0.5}> (5.0)</Typography>
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <Typography textTransform='uppercase' fontSize={16} fontWeight={500} marginTop={1}>{toMoney(product.price)} COP</Typography>
                        </Grid>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>
    )
}
