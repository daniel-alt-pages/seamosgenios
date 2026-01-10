import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SiteConfigProvider } from './contexts/SiteConfigContext'
import { ToastProvider } from './components/ui/Toast'
import { ChangesProvider, ChangesStatusBar } from './components/admin/ChangesSystem'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SiteConfigProvider>
          <ToastProvider>
            <ChangesProvider>
              <App />
              <ChangesStatusBar />
            </ChangesProvider>
          </ToastProvider>
        </SiteConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
