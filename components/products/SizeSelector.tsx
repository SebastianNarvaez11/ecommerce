import { Box, Button } from '@mui/material'
import { FC } from 'react'
import { ISize } from '../../interfaces'

interface Props {
    selectedSize?: ISize,
    sizes: ISize[],
    onSelectedSize : (size: ISize) => void
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes, onSelectedSize}) => {
    return (
        <Box marginBottom={1}>
            {sizes.map(size => (
                <Button key={size} size='small' color={selectedSize === size ? 'secondary' : 'inherit'} style={{margin: 1}} onClick={() => onSelectedSize(size)}>
                    {size}
                </Button>
            ))}
        </Box>
    )
}
