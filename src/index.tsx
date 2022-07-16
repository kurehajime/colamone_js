import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reportWebVitals from './reportWebVitals'
import "./i18n/configs"
import { Util } from './static/Util'
import Colamone from './components/Colamone'

Util.zoom() // 小さい端末でズーム
window.addEventListener('orientationchange', Util.zoom)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <Colamone></Colamone>
  </React.StrictMode>
)
reportWebVitals()
