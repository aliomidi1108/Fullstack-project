import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

let unauthorizedHandler = null

const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler
}

let accessToken = null

const setAccessToken = (token) => {
  accessToken = token || null
}

const getToken = () => accessToken || localStorage.getItem('auth_token')

const attachAuthHeader = (config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

api.interceptors.request.use(attachAuthHeader)
refreshClient.interceptors.request.use(attachAuthHeader)

let isRefreshing = false
let pendingRequests = []

const resolvePending = (token) => {
  pendingRequests.forEach((cb) => cb(token))
  pendingRequests = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config
    const status = error?.response?.status

    if (status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push((token) => {
            if (token) {
              originalRequest.headers = originalRequest.headers || {}
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(api(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true
      try {
        const { data } = await refreshClient.post('/auth/refresh')
        const newToken = data?.token
        if (newToken) {
          setAccessToken(newToken)
          resolvePending(newToken)
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        resolvePending(null)
        if (unauthorizedHandler) unauthorizedHandler()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    if (status === 401 && unauthorizedHandler) {
      unauthorizedHandler()
    }
    return Promise.reject(error)
  }
)

export { setUnauthorizedHandler, setAccessToken }
export default api
