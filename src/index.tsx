import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reportWebVitals from './reportWebVitals'
import "./i18n/configs"
import { Util } from './static/Util'
import Colamone from './components/Colamone'
import { HoverProvider } from './contexts/HoverContext'
import __wbg_init from '../wasm/pkg/colamone'
// wasm初期化
try {
  __wbg_init()
} catch (error) {
  console.log(error)
}

Util.zoom() // 小さい端末でズーム
window.addEventListener('orientationchange', Util.zoom)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <HoverProvider>
    <React.StrictMode>
      <Colamone></Colamone>
    </React.StrictMode>
  </HoverProvider>
)
reportWebVitals()
