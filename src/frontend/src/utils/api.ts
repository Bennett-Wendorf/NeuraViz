import axios from 'axios';

const baseURL = '/api'

// Create the axios component with the custom baseURL
const api = axios.create({
    baseURL: baseURL,
    timeout: 2000,
    headers: {
        'Content-Type': 'application/json',
    }
})

export default api