import React from 'react'

import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

import { Context as ContextApp } from './App'

function App() {
  const contextApp = React.useContext(ContextApp)

  const ref = React.useRef(null)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (ref.current) clearTimeout(ref.current)
    if (contextApp.loadingArray.length !== 0) setOpen(true)
    if (contextApp.loadingArray.length === 0) ref.current = setTimeout(() => { setOpen(false); ref.current = null; }, 500)
  }, [contextApp.loadingArray])

  const Component = <Backdrop open={open} style={{ zIndex: 10001 }}><CircularProgress style={{ color: 'white' }} size={40} /></Backdrop>

  return Component
}

export default App