import axios from 'axios'

const tesloApi = axios.create({
    baseURL: '/api',
    headers: {}
})

export default tesloApi