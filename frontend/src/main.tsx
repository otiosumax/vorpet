import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import HomeView from './views/homeView'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HomeView />
  </StrictMode>,
)
