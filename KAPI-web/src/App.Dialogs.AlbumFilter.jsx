import React from 'react'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { Context as ContextApp } from './App'

function App() {
  const contextApp = React.useContext(ContextApp)

  const [text, setText] = React.useState('')

  const onConfirm = () => {
    contextApp.dialogsArrayAction.props('AlbumFilter').onConfirm(text)
    contextApp.dialogsArrayAction.remove('AlbumFilter')
  }

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('AlbumFilter')) {
      setText(contextApp.dialogsArrayAction.props('AlbumFilter').text)
    }
  }, [contextApp.dialogsArrayAction.exist('AlbumFilter')])

  const Component =
    <Dialog open={contextApp.dialogsArrayAction.exist('AlbumFilter')} onClose={() => contextApp.dialogsArrayAction.remove('AlbumFilter')}>
      <DialogTitle>
        <Typography color='primary' style={{ fontSize: 20 }}>输入关键词筛选</Typography>
      </DialogTitle>
      <DialogContent style={{ paddingTop: 4 }}>
        <TextField fullWidth autoComplete='off' size='small' variant='outlined' value={text} onChange={e => setText(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => contextApp.dialogsArrayAction.remove('AlbumFilter')}>取消</Button>
        <Button onClick={() => onConfirm()}>确认</Button>
      </DialogActions>
    </Dialog>

  return Component
}

export default App