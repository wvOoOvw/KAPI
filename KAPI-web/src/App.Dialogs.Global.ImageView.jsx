import React from 'react'

import Backdrop from '@mui/material/Backdrop'

import Image from './App.ComponentPure.Image'

import { Context as ContextApp } from './App'

function App() {
  const contextApp = React.useContext(ContextApp)

  const [image, setImage] = React.useState()

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('ImageView')) {
      setImage(contextApp.dialogsArrayAction.props('ImageView')?.image || undefined)
    }
  }, [contextApp.dialogsArrayAction.exist('ImageView')])

  const Component =
    <Backdrop open={contextApp.dialogsArrayAction.exist('ImageView')} onClick={() => contextApp.dialogsArrayAction.remove('ImageView')} style={{ backdropFilter: 'blur(4px)', zIndex: 10000 }}>
      <div style={{ width: '100%', height: '100%', opacity: contextApp.dialogsArrayAction.exist('ImageView') ? 1 : 0, transition: '0.2s all' }}>
        {
          image ?
            <>
              <Image
                lazy
                src={image}
                mode='BackgroundContain'
                loadingSize={32}
                style={{ width: '100%', height: '100%' }}
              />
            </>
            : null
        }
      </div>
    </Backdrop>

  return Component
}

export default App