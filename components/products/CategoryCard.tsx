import { Card, CardActionArea, CardMedia, Typography } from "@mui/material"
import { FC } from "react"

interface Props {
    name: string,
    img: string
}

export const CategoryCard: FC<Props> = ({name, img}) => {
    return (
        <Card sx={{ width: 100, display: 'inline-table', marginRight: 5 }}>
            <CardActionArea sx={{ padding: 1 }}>
                <CardMedia component='img' image={`img/categories/${img}`} alt={`categoria ${name}`} />
                <Typography align="center" marginTop={1} sx={{ fontSize: 14 }} color="text.secondary">
                    {name}
                </Typography>
            </CardActionArea>
        </Card>
    )
}
