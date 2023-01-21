import { NextPage, GetServerSideProps } from 'next'
import { AuthLayout } from '../../components/layouts'
import { Grid, Typography, TextField, Button, Box, Chip, Divider } from '@mui/material'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { isEmail } from '../../utils'
import { tesloApi } from '../../api'
import { ErrorOutline } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { loginUser } from '../../store/thunks'
import { useAppDispatch } from '../../store/hooks'
import { useRouter } from 'next/router'
import { getProviders, getSession, signIn } from 'next-auth/react'


type FormData = {
    email: string,
    password: string
}


const LoginPage: NextPage = () => {

    const dispatch = useAppDispatch()
    const router = useRouter()
    const [showError, setShowError] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const [providers, setProviders] = useState<any>({});
    useEffect(() => {
        getProviders().then(prov => {
            setProviders(prov)
        })
    }, [])


    const onLoginUser = async ({ email, password }: FormData) => {

        setShowError(false)
        // const isValidLogin = await dispatch(loginUser(email, password))

        // if (!isValidLogin) {
        //     setShowError(true)
        //     setTimeout(() => { setShowError(false) }, 4000);
        //     return
        // }

        // const destination = router.query.p?.toString() || '/'
        // router.replace(destination)
        await signIn('credentials', { email, password })
    }




    return (
        <AuthLayout title='Ingresar'>
            <form onSubmit={handleSubmit(onLoginUser)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component="h1">Iniciar Sesión</Typography>

                            {showError &&
                                <Chip
                                    label='NO RECONOCEMOS ESE USUARIO / CONTRASEÑA'
                                    color='error'
                                    icon={<ErrorOutline />}
                                    className='fadeIn' />
                            }
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type='email'
                                label="Correo"
                                variant="filled"
                                fullWidth
                                {...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: isEmail
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Contraseña"
                                type='password'
                                variant="filled"
                                fullWidth
                                {...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Minimo 6 caracteres' }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button color="secondary" className='circular-btn' size='large' fullWidth type='submit'>
                                Ingresar
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <Link href={router.query.p ? `/auth/register?p=${router.query.p}` : `/auth/register`}>
                                    ¿No tienes cuenta?
                            </Link>
                        </Grid>


                        <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                            <Divider sx={{ width: '100%', mb: 2 }} />
                            {
                                Object.values(providers).map((provider: any) => {

                                    if (provider.id === 'credentials') return (<div key="credentials"></div>);
                                    return (
                                        <Button
                                            key={provider.id}
                                            variant="outlined"
                                            fullWidth
                                            color="primary"
                                            sx={{ mb: 1 }}
                                            onClick={() => signIn(provider.id)}
                                        >
                                            {provider.name}
                                        </Button>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const session = await getSession({ req })

    const { p = '/' } = query

    if (session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {

        }
    }
}

export default LoginPage