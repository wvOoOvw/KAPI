import React from 'react'
import * as ReactRouterDom from "react-router-dom"

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
  const navigate = ReactRouterDom.useNavigate()

  const contextApp = React.useContext(ContextApp)

  const onPickCoin = () => {
    contextApp.dialogsArrayAction.remove('SystemPick')
    navigate('/systemrecharge')
  }

  const onPickAccountSearch = () => {
    contextApp.dialogsArrayAction.remove('SystemPick')
    navigate('/systemresearch')
  }

  const Component =
    <Dialog open={contextApp.dialogsArrayAction.exist('SystemPick')} onClose={() => contextApp.dialogsArrayAction.remove('SystemPick')} sx={{ '& .MuiDialog-paper': { width: 600, maxWidth: 'unset' } }}>
      <DialogTitle>
        <Typography color='primary' style={{ fontSize: 20 }}>系统设置</Typography>
      </DialogTitle>
      <DialogContent style={{ paddingTop: 4, display: 'flex', justifyContent: 'center', gap: 12 }}>
        <Button variant='contained' onClick={onPickCoin}><CameraAltIcon style={{ marginRight: 4 }} />充值硬币</Button>
        <Button variant='contained' onClick={onPickAccountSearch}><CameraAltIcon style={{ marginRight: 4 }} />查询账号</Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => contextApp.dialogsArrayAction.remove('SystemPick')}>取消</Button>
      </DialogActions>
    </Dialog>

  return Component
}

export default App