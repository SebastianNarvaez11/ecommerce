import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"
import { Box, IconButton, Typography } from "@mui/material"
import { FC } from "react"

interface Props {
    currentValue: number,
    onUpdateQuantity : (quantity: number) => void,
    maxValue: number
}

export const ItemCounter: FC<Props> = ({ currentValue, onUpdateQuantity, maxValue }) => {

    const removeItem = () => {
        if(currentValue > 1){
            onUpdateQuantity(currentValue - 1)
        }
    }

    const addItem = () => {
        if(currentValue < maxValue) {
            onUpdateQuantity(currentValue + 1)
        }
    }
 
    return (
        <Box display='flex' alignItems='center'>
            <IconButton onClick={removeItem}>
                <RemoveCircleOutline />
            </IconButton>
            <Typography sx={{ width: 40, textAlign: 'center' }}> {currentValue} </Typography>
            <IconButton onClick={addItem}>
                <AddCircleOutline />
            </IconButton>
        </Box>
    )
}
