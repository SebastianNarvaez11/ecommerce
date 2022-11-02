import { SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material"
import NextLink from "next/link"
import { AppBar, Toolbar, Link, Typography, Box, IconButton, Badge, Button, FormControl, OutlinedInput, InputAdornment } from "@mui/material"

export const Navbar = () => {
    return (
        <AppBar elevation={0} position='fixed' style={{ backgroundColor: 'white', height: 60 }}>
            <Toolbar style={{ justifyContent: 'space-between' }}>

                <Box flex={1} >
                    <NextLink href="/" passHref>
                        <Link display="flex" alignItems="center" underline="none">
                            <Typography variant="h6">Tienda</Typography>
                        </Link>
                    </NextLink>
                </Box>

                <Box flex={2} >
                    <Box sx={{ display: { xs: 'none', sm: 'block', md: 'block' } }}>
                        <FormControl variant="outlined" style={{ width: '100%' }}>
                            <OutlinedInput
                                size="small"
                                placeholder="Buscar"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton>
                                            <SearchOutlined />
                                        </IconButton>
                                    </InputAdornment>} />
                        </FormControl>
                    </Box>
                </Box>

                <Box flex={1} textAlign='end'>
                    <NextLink href="/cart" passHref >
                        <Link >
                            <IconButton>
                                <Badge badgeContent={2} color='secondary'>
                                    <ShoppingCartOutlined />
                                </Badge>
                            </IconButton>
                        </Link>
                    </NextLink>
                </Box>








            </Toolbar>
        </AppBar>
    )
}
