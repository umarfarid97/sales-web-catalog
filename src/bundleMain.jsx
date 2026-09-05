import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BundleApp from './BundleApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BundleApp />
  </StrictMode>,
)
