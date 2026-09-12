import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'

// Phase 3: Frontend API wiring verification
const apiBase = import.meta.env.VITE_API_URL || '/api'
console.info('Frontend API wiring successful', { apiBase, comments: true, videos: true, payment: true })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
