import Link from "next/link"
import { useRouter } from "next/router"

import { SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material"
import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Button, FormControl, OutlinedInput, InputAdornment } from "@mui/material"

import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { set_is_menu_open, set_search_term } from "../../store/slices/uiSlice"




export const Navbar = () => {

    const { searchTerm } = useAppSelector(state => state.ui)
    const { numberOfItems } = useAppSelector(state => state.cart)

    const { asPath, push } = useRouter()
    const dispatch = useAppDispatch()


    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return
        navigateTo(`/search/${searchTerm}`)
    }

    const navigateTo = (url: string) => {
        push(url) //push es una funcion que viene del useRouter
    }


    return (
        <AppBar elevation={0} position='fixed' style={{ backgroundColor: 'white', height: 60 }}>
            <Toolbar style={{ justifyContent: 'space-between' }}>

                <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6">Tienda</Typography>
                </Link>

                <Box flex={1} />

                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Link href='/category/men' style={{ textDecoration: 'none' }}>
                        <Button color={asPath === '/category/men' ? 'info' : 'primary'}>Hombres</Button>
                    </Link>
                    <Link href='/category/women' style={{ textDecoration: 'none' }}>
                        <Button color={asPath === '/category/women' ? 'info' : 'primary'}>Mujeres</Button>
                    </Link>
                    <Link href='/category/kid' style={{ textDecoration: 'none' }}>
                        <Button color={asPath === '/category/kid' ? 'info' : 'primary'}>Niños</Button>
                    </Link>
                </Box>


                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <FormControl variant="outlined" style={{ width: '100%' }}>
                        <OutlinedInput
                            size="small"
                            placeholder="Buscar"
                            value={searchTerm}
                            onChange={(e) => dispatch(set_search_term(e.target.value))}
                            onKeyDown={(e) => e.key === 'Enter' ? onSearchTerm() : null}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={onSearchTerm}>
                                        <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>} />
                    </FormControl>
                </Box>



                <IconButton sx={{ display: { xs: 'flex', md: 'none' } }} onClick={() => dispatch(set_is_menu_open())}>
                    <SearchOutlined />
                </IconButton>

                <Link href="/cart" >
                    <IconButton>
                        <Badge badgeContent={numberOfItems} color='secondary'>
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>
                </Link>

                <Button onClick={() => dispatch(set_is_menu_open())}>
                    Menú
                </Button>


            </Toolbar>
        </AppBar>
    )
}
