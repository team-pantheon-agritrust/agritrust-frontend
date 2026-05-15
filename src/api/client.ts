import axios from 'axios'

const client = axios.create({
  baseURL: 'https://agritrust-backend-4zhi.onrender.com/api/squad',
  headers: { 'Content-Type': 'application/json' },
})

export default client
