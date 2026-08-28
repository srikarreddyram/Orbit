import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// A confirm() dialog here is unreliable on mobile — it fires async, outside
// a direct user gesture, and some mobile browsers silently suppress it,
// leaving the app stuck on a stale cached build indefinitely. Auto-updating
// instead matches the registerType: 'autoUpdate' intent in vite.config.js.
const updateSW = registerSW({
  onNeedRefresh() {
    updateSW(true)
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
