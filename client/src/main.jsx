import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
import AppLoader from './components/AppLoader'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppLoader>
        <App />
      </AppLoader>
    </BrowserRouter>
  </StrictMode>
)
