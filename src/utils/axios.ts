import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
