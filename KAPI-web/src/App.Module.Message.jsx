import React from 'react'

import Snackbar from '@mui/material/Snackbar'

import { Context as ContextApp } from './App'

function App() {
  const contextApp = React.useContext(ContextApp)

  const ref = React.useRef(null)

  React.useEffect(() => {
    if (ref.current === null && contextApp.messageArray.length > 0) {
      ref.current = setTimeout(
        () => {
          ref.current = null
          contextApp.setMessageArray(i => i.filter((v, index) => index !== 0))
        },
        2000
      )
    }
  }, [contextApp.messageArray])

  const Component =
    <>
      {
        contextApp.messageArray.map((i, index) => {
          return <Snackbar key={i.key} message={i.message} open={true} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} style={{ zIndex: 10002, top: 32 + index * 48 * 1.25, transition: '0.2s all' }} />
        })
      }
    </>

  return Component
}

export default App