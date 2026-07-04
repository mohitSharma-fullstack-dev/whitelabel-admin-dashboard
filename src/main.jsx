import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/ui.css'
import './styles/sidebar.css'
import './styles/dashboard.css'
import './styles/login.css'
import './styles/phone.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
