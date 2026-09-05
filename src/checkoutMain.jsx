import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CheckoutApp from './CheckoutApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CheckoutApp />
  </StrictMode>,
)
