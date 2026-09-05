import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import WomenApp from './WomenApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WomenApp />
  </StrictMode>,
)
