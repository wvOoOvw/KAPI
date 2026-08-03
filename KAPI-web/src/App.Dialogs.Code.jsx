import React from 'react'

import fingerprintjs from '@fingerprintjs/fingerprintjs'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { Context as ContextApp } from './App'

import { Fetch } from './utils.fetch'

function App() {
  const contextApp = React.useContext(ContextApp)

  const deviceId = React.useRef()

  const [code, setCode] = React.useState('')

  const onCode = async () => {
    contextApp.loadingArrayAction.add('SettingCoin')

    await Fetch.json('/api/app/configuration/code', { code: code, deviceId: deviceId.current })
      .then(res => {
        setCode('')
        contextApp.messageArrayAction.add(res.data || '领取成功')
      })
      .catch(res => {
        contextApp.messageArrayAction.add(res.message || '领取失败')
      })

    contextApp.loadingArrayAction.remove('SettingCoin')
  }

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('Code')) {
      setCode('')
    }
    if (contextApp.dialogsArrayAction.exist('Code') && contextApp.user === undefined) {
      contextApp.dialogsArrayAction.remove('Code').add('UserLogin')
      contextApp.messageArrayAction.add('请先登录')
    }
  }, [contextApp.dialogsArrayAction.exist('Code')])

  React.useEffect(() => {
    fingerprintjs.load().then(res => res.get()).then(res => deviceId.current = res.visitorId)
  }, [])

  const Component =
    <Dialog open={contextApp.dialogsArrayAction.exist('Code')} onClose={() => contextApp.dialogsArrayAction.remove('Code')} sx={{ '& .MuiDialog-paper': { width: 600, maxWidth: 'unset' } }}>
      <DialogTitle>
        <Typography color='primary' style={{ fontSize: 20 }}>兑换码</Typography>
      </DialogTitle>
      <DialogContent style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <TextField fullWidth autoComplete='off' size='small' label='输入兑换码' variant='outlined' value={code} onChange={e => setCode(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={onCode} disabled={deviceId.value === ''}>兑换</Button>
      </DialogActions>
    </Dialog >

  return Component
}

export default App