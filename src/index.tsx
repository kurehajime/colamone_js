import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reportWebVitals from './reportWebVitals'
import "./i18n/configs"
import { Util } from './static/Util'
import Colamone from './components/Colamone'
import { RecoilRoot } from 'recoil'
import init from '../wasm/pkg'
// wasm初期化
try {
  init()
} catch (error) {
  console.log(error)
}

Util.zoom() // 小さい端末でズーム
window.addEventListener('orientationchange', Util.zoom)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <RecoilRoot>
    <React.StrictMode>
      <Colamone></Colamone>
    </React.StrictMode>
  </RecoilRoot>
)
reportWebVitals()
