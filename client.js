import axios from 'axios'

// Single source of truth for the backend URL.
// Ask your Flask teammate for the real value and put it in a .env file as VITE_API_BASE_URL.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach the saved token (if any) to every request.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('dayflow_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If the backend ever says the token is invalid/expired, log the user out
// and send them back to the login screen.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dayflow_token')
      localStorage.removeItem('dayflow_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client

// ---- API calls, one function per endpoint ----
// Keeping these in one place means components never write raw URLs.

export const loginRequest = (email, password) =>
  client.post('/api/login', { email, password })

export const getEmployees = () => client.get('/api/employees')

export const getEmployee = (id) => client.get(`/api/employees/${id}`)

export const getAttendance = (employeeId) =>
  client.get(`/api/attendance/${employeeId}`)

export const getLeaves = () => client.get('/api/leaves')

export const approveLeave = (id) => client.put(`/api/leaves/${id}/approve`)

export const rejectLeave = (id) => client.put(`/api/leaves/${id}/reject`)

export const getPayroll = (employeeId) =>
  client.get(`/api/payroll/${employeeId}`)

export const updatePayroll = (employeeId, data) =>
  client.put(`/api/payroll/${employeeId}`, data)
