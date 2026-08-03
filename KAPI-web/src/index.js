import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

import './index.css'

if (new URLSearchParams(new URL(window.location.href).search).get('dev')) {
  const vconsole = document.createElement('script')
  vconsole.src = 'https://cdn.bootcdn.net/ajax/libs/vConsole/3.15.1/vconsole.min.js'
  vconsole.onload = () => new VConsole()
  document.getElementsByTagName('body')[0].appendChild(vconsole)
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

// https://pixiviz.xyz/rank