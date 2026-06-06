import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reportWebVitals from './reportWebVitals'
import "./i18n/configs"
import { Util } from './static/Util'
import Colamone from './components/Colamone'
import { HoverProvider } from './contexts/HoverContext'
import __wbg_init from '../wasm/pkg/colamone'
import { ENABLE_WASM } from './static/WasmConfig'
// wasm初期化
if (ENABLE_WASM) {
  try {
    __wbg_init()
  } catch (error) {
    console.log(error)
  }
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
