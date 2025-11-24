import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LoseButton from './lose.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoseButton />
    <App />
    
  </StrictMode>,
)
