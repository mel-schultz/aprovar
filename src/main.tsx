import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@primer/css/dist/primer.css'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
