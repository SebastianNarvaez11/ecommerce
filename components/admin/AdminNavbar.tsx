import Link from 'next/link';


import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

import { useAppDispatch } from '../../store/hooks';
import { set_is_menu_open } from '../../store/slices/uiSlice';

export const AdminNavbar = () => {

    const dispatch = useAppDispatch()

    return (
        <AppBar>
            <Toolbar>
                <Link href='/' style={{display: 'flex', alignItems:'center'}} >
                        <Typography variant='h6'>Teslo |</Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                </Link>

                <Box flex={ 1 } />

                <Button onClick={ () => dispatch(set_is_menu_open()) }>
                    Menú
                </Button>

            </Toolbar>
        </AppBar>
    )
}