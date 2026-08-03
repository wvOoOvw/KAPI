import React from 'react'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { Context as ContextApp } from './App'

import ContactChatWX from '../static/image/ContactChatWX.jpg'

function App() {
  const contextApp = React.useContext(ContextApp)

  const [tab, setTab] = React.useState(0)

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('ContactChat')) {
      setTab(contextApp.dialogsArrayAction.props('ContactChat')?.defaultTab || 0)
    }
  }, [contextApp.dialogsArrayAction.exist('ContactChat')])

  const Component =
    <Dialog open={contextApp.dialogsArrayAction.exist('ContactChat')} onClose={() => contextApp.dialogsArrayAction.remove('ContactChat')} sx={{ '& .MuiDialog-paper': { width: 600, maxWidth: 'unset' } }}>
      <DialogTitle>
        <Typography color='primary' style={{ fontSize: 20 }}>联系WX</Typography>
      </DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 12 }}>
        <img src={ContactChatWX} style={{ width: '80%', maxWidth: 320, margin: 'auto' }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => contextApp.dialogsArrayAction.remove('ContactChat')}>我知道了</Button>
      </DialogActions>
    </Dialog>

  return Component
}

export default App