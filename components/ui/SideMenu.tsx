import { useRouter } from "next/router"
import { signOut } from 'next-auth/react'
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import {
    AccountCircleOutlined, AdminPanelSettings,
    CategoryOutlined, ConfirmationNumberOutlined,
    DashboardOutlined,
    EscalatorWarningOutlined, FemaleOutlined,
    LoginOutlined, MaleOutlined, SearchOutlined,
    VpnKeyOutlined
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { set_is_menu_open, set_search_term } from "../../store/slices/uiSlice"
import Cookie from "js-cookie"


export const SideMenu = () => {

    const router = useRouter()

    const { searchTerm, isMenuOpen } = useAppSelector(state => state.ui)
    const { user, isLoggedIn } = useAppSelector(state => state.auth)

    const dispatch = useAppDispatch()


    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return
        navigateTo(`/search/${searchTerm}`)
    }

    const navigateTo = (url: string) => {
        dispatch(set_is_menu_open())
        router.push(url)
    }

    const logoutUser = () => {
        Cookie.remove('firstName'),
            Cookie.remove('lastName'),
            Cookie.remove('address'),
            Cookie.remove('address2'),
            Cookie.remove('zip'),
            Cookie.remove('city'),
            Cookie.remove('country'),
            Cookie.remove('phone'),
            Cookie.remove('cart')

        signOut()
        // Cookie.remove('token')
        // router.reload()
    }


    return (
        <Drawer
            open={isMenuOpen}
            onClose={() => dispatch(set_is_menu_open())}
            anchor='right'
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
        >
            <Box sx={{ width: 250, paddingTop: 5 }}>
                <List>
                    <ListItem>
                        <Input
                            type='text'
                            placeholder="Buscar..."
                            autoFocus
                            value={searchTerm}
                            onChange={(e) => dispatch(set_search_term(e.target.value))}
                            onKeyDown={(e) => e.key === 'Enter' ? onSearchTerm() : null}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={onSearchTerm}
                                    >
                                        <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>

                    {isLoggedIn &&
                        <>
                            <ListItemButton >
                                <ListItemIcon>
                                    <AccountCircleOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Perfil'} />
                            </ListItemButton>

                            <ListItemButton onClick={() => navigateTo('/orders/history')}>
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Mis Ordenes'} />
                            </ListItemButton>
                        </>
                    }


                    <ListItemButton sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/men')}>
                        <ListItemIcon>
                            <MaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Hombres'} />
                    </ListItemButton>

                    <ListItemButton sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/women')}>
                        <ListItemIcon>
                            <FemaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Mujeres'} />
                    </ListItemButton>

                    <ListItemButton sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/kid')}>
                        <ListItemIcon>
                            <EscalatorWarningOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Niños'} />
                    </ListItemButton>

                    {isLoggedIn
                        ? <ListItemButton onClick={logoutUser}>
                            <ListItemIcon>
                                <LoginOutlined />
                            </ListItemIcon>
                            <ListItemText primary={'Salir'} />
                        </ListItemButton>
                        :
                        <ListItemButton onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}>
                            <ListItemIcon>
                                <VpnKeyOutlined />
                            </ListItemIcon>
                            <ListItemText primary={'Ingresar'} />
                        </ListItemButton>
                    }





                    {user?.role === 'admin' &&
                        <>
                            <Divider />
                            <ListSubheader>Admin Panel</ListSubheader>

                            <ListItemButton onClick={() => navigateTo('/admin')}>
                                <ListItemIcon>
                                    <DashboardOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Dashboard'} />
                            </ListItemButton>

                            <ListItemButton onClick={() => navigateTo('/admin/products')}>
                                <ListItemIcon>
                                    <CategoryOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Productos'} />
                            </ListItemButton>
                            
                            <ListItemButton onClick={() => navigateTo('/admin/orders')}>
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Ordenes'} />
                            </ListItemButton>

                            <ListItemButton onClick={() => navigateTo('/admin/users')}>
                                <ListItemIcon>
                                    <AdminPanelSettings />
                                </ListItemIcon>
                                <ListItemText primary={'Usuarios'} />
                            </ListItemButton>
                        </>
                    }
                </List>
            </Box>
        </Drawer>
    )
}