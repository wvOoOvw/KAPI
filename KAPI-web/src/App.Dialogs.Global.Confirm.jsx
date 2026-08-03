import React from 'react'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'

import { Context as ContextApp } from './App'

function App() {
  const contextApp = React.useContext(ContextApp)

  const onConfirm = () => {
    contextApp.dialogsArrayAction.remove('Confirm').props('Confirm')?.onConfirm?.()
  }

  const Component =
    <Dialog open={contextApp.dialogsArrayAction.exist('Confirm')} onClose={() => contextApp.dialogsArrayAction.remove('Confirm')} sx={{ '& .MuiDialog-paper': { width: 600, maxWidth: 'unset' } }}>
      {
        contextApp.dialogsArrayAction.props('Confirm')?.title ?
          <DialogTitle>
            <Typography color='primary' style={{ fontSize: 20 }}>{contextApp.dialogsArrayAction.props('Confirm').title}</Typography>
          </DialogTitle>
          : null
      }
      {
        contextApp.dialogsArrayAction.props('Confirm')?.content ?
          <DialogContent>
            <Typography color='primary' style={{ fontSize: 16 }}>{contextApp.dialogsArrayAction.props('Confirm').content}</Typography>
          </DialogContent>
          : null
      }
      <DialogActions>
        <Button onClick={() => contextApp.dialogsArrayAction.remove('Confirm')}>取消</Button>
        <Button onClick={onConfirm}>确认</Button>
      </DialogActions>
    </Dialog>

  return Component
}

export default App