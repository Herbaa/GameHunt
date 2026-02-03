import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GiveUpButton from './GiveUpButton.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GiveUpButton />
    <App />
    
  </StrictMode>,
)
