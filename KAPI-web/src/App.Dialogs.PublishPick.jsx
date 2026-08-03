import React from 'react'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import CameraAltIcon from '@mui/icons-material/CameraAlt'

import { Context as ContextApp } from './App'

function App() {
  const contextApp = React.useContext(ContextApp)

  const onPickAlbum = () => {
    contextApp.dialogsArrayAction.remove('PublishPick').add('AlbumInformationOperation')
  }

  const onPickCartoon = () => {
    contextApp.dialogsArrayAction.remove('PublishPick').add('CartoonInformationOperation')
  }

  const Component =
    <Dialog open={contextApp.dialogsArrayAction.exist('PublishPick')} onClose={() => contextApp.dialogsArrayAction.remove('PublishPick')} sx={{ '& .MuiDialog-paper': { width: 600, maxWidth: 'unset' } }}>
      <DialogTitle>
        <Typography color='primary' style={{ fontSize: 20 }}>发布作品</Typography>
      </DialogTitle>
      <DialogContent style={{ paddingTop: 4, display: 'flex', justifyContent: 'center', gap: 12 }}>
        <Button variant='contained' onClick={onPickAlbum}><CameraAltIcon style={{ marginRight: 4 }} />发布图集</Button>
        <Button variant='contained' onClick={onPickCartoon}><CameraAltIcon style={{ marginRight: 4 }} />发布漫画</Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => contextApp.dialogsArrayAction.remove('PublishPick')}>取消</Button>
      </DialogActions>
    </Dialog>

  return Component
}

export default App