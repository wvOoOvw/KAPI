import React from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { Context as ContextApp } from './App'

import { Fetch } from './utils.fetch'

function App() {
  const contextApp = React.useContext(ContextApp)

  const [credential, setCredential] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onRegister = () => {
    contextApp.dialogsArrayAction.remove('UserLogin').add('UserRegister')
  }

  const onEnsure = async () => {
    contextApp.loadingArrayAction.add('UserLogin')

    await Fetch.json('/api/app/user/find/login/credential', { credential, password })
      .then(res => {
        localStorage.setItem('User_Authorization', res.data.authorization)
        Fetch.connect(res.data.authorization)
        contextApp.setUser(res.data)
        contextApp.dialogsArrayAction.remove('UserLogin')
        contextApp.messageArrayAction.add('登录成功')
      })
      .catch(res => {
        contextApp.messageArrayAction.add(res.message || '系统异常')
      })

    contextApp.loadingArrayAction.remove('UserLogin')
  }

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('UserLogin')) {
      setCredential('')
      setPassword('')
    }
  }, [contextApp.dialogsArrayAction.exist('UserLogin')])

  const Component =
    <Dialog open={contextApp.dialogsArrayAction.exist('UserLogin')} onClose={() => contextApp.dialogsArrayAction.remove('UserLogin')} sx={{ '& .MuiDialog-paper': { width: 600, maxWidth: 'unset' } }}>
      <DialogTitle>
        <Typography color='primary' style={{ fontSize: 20 }}>登录</Typography>
      </DialogTitle>
      <DialogContent style={{ paddingTop: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <TextField fullWidth autoComplete='off' size='small' label='账号' variant='outlined' color='primary' value={credential} onChange={e => setCredential(e.target.value)} />
          <TextField fullWidth autoComplete='off' size='small' label='密码' variant='outlined' color='primary' value={password} onChange={e => setPassword(e.target.value)} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onRegister}>前往注册</Button>
        <Button onClick={onEnsure}>登录</Button>
      </DialogActions>
    </Dialog>

  return Component
}

export default App