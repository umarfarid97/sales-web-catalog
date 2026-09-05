import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CollectionApp from './CollectionApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CollectionApp />
  </StrictMode>,
)
