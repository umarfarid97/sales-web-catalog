import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MenApp from './MenApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MenApp />
  </StrictMode>,
)
