import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { installGlobalErrorHandlers } from './store/errorStore'

installGlobalErrorHandlers()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
