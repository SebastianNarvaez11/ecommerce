import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getSession, signIn } from 'next-auth/react';

import { Box, Button, Chip, Grid, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form'
import { AuthLayout } from '../../components/layouts'
import { isEmail } from '../../utils';
import { useState } from 'react';
import { ErrorOutline } from '@mui/icons-material';
import { registerUser } from '../../store/thunks';
import { useAppDispatch } from '../../store/hooks';

type FormData = {
    name: string,
    email: string,
    password: string
}


const RegisterPage = () => {

    const router = useRouter()
    const dispatch = useAppDispatch()

    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();



    const onRegisterUser = async ({ name, email, password }: FormData) => {

        setShowError(false)

        const { hasError, message } = await dispatch(registerUser(name, email, password))

        if (hasError) {
            setShowError(true)
            setTimeout(() => { setShowError(false) }, 4000);
            setErrorMessage(message!)
            return
        }

        // const destination = router.query.p?.toString() || '/'
        // router.replace(destination)
        await signIn('credentials', { email, password })
    }

    return (
        <AuthLayout title={'Ingresar'}>
            <form onSubmit={handleSubmit(onRegisterUser)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component="h1">Crear cuenta</Typography>

                            {showError &&
                                <Chip
                                    label={errorMessage}
                                    color='error'
                                    icon={<ErrorOutline />}
                                    className='fadeIn' />
                            }

                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Nombre completo"
                                variant="filled"
                                fullWidth
                                {...register('name', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 2, message: 'Minimo 2 caracteres' }
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Correo"
                                variant="filled"
                                fullWidth
                                {...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: isEmail
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message} />
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
                                Registrarse
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <Link href={router.query.p ? `/auth/login?p=${router.query.p}` : `/auth/login`}>
                                ¿Ya tienes cuenta?
                            </Link>
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


export default RegisterPage