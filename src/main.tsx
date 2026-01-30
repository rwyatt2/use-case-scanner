import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { FeatureFlagsProvider } from '@/context/FeatureFlags'
import { AuthProvider } from '@/context/AuthContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { ChatProvider } from '@/context/ChatContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
<FeatureFlagsProvider>
        <AuthProvider>
          <FavoritesProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </FavoritesProvider>
        </AuthProvider>
        </FeatureFlagsProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
