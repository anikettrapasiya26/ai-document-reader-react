import axios from 'axios'
const base_url = `${process.env.REACT_APP_API_URL}`
const rasa_url = `${process.env.REACT_APP_RASA_URL}`
console.log(base_url, rasa_url)
const api = axios.create({
  baseURL: `${base_url}/api/v1/`,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
})

export const rasaApi = axios.create({
  baseURL: `${rasa_url}`,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
})

api.interceptors.request.use(
  (config) => {
    if (
      !(
        config.url === '/api/v1/auth/signin' ||
        config.url === '/api/v1/auth/signup' ||
        config.url === '/api/v1/auth/forgot'
      ) &&
      config.headers
    ) {
      config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
    }

    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

export const docApi = axios.create({
  baseURL: `${base_url}/api/v1/`,
  headers: {
    'Content-Type': 'multipart/form-data',
    'Cache-Control': 'no-cache',
  },
})
docApi.interceptors.request.use(
  (config) => {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
    }

    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

export const profileApi = axios.create({
  baseURL: `${base_url}/api/v1/`,
  headers: {
    'Content-Type': 'multipart/form-data',
    'Cache-Control': 'no-cache',
  },
})
profileApi.interceptors.request.use(
  (config) => {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
    }

    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

export default api
