import { IProduct } from './../interfaces';
import useSWR, { SWRConfiguration } from 'swr'


// se debe especificar el fetcher como provider en el _app.tsx

export const useProducts = (url: string, config: SWRConfiguration = {}) => {

    const { data, error } = useSWR<IProduct[]>(`/api${url}`, config)

    return {
        products: data || [],
        isLoading: !error && !data,
        isError: error
    }
}