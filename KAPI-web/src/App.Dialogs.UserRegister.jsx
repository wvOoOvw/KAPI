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

  const onCreateCredential = () => {
    setCredential(Array.from(Array(24), () => Math.floor(Math.random() * 36).toString(36)).join('').toUpperCase())
  }

  const onLogin = () => {
    contextApp.dialogsArrayAction.remove('UserRegister').add('UserLogin')
  }

  const onEnsure = async () => {
    if (credential.length < 8 || credential.length > 32 || credential.match(/^[a-zA-Z0-9]+$/) === null) {
      contextApp.messageArrayAction.add('请输入8-32位字母数字的账号')
      return
    }

    if (password.length < 8 || password.length > 32 || password.match(/^[a-zA-Z0-9]+$/) === null) {
      contextApp.messageArrayAction.add('请输入8-32位字母数字的密码')
      return
    }

    contextApp.loadingArrayAction.add('UserRegister')

    await Fetch.json('/api/app/user/insert', { credential, password })
      .then(res => {
        localStorage.setItem('User_Authorization', res.data.authorization)
        Fetch.connect(res.data.authorization)
        contextApp.setUser(res.data)
        contextApp.dialogsArrayAction.remove('UserRegister')
        contextApp.messageArrayAction.add('注册成功')
      })
      .catch(res => {
        contextApp.messageArrayAction.add(res.message || '系统异常')
      })

    contextApp.loadingArrayAction.remove('UserRegister')
  }

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('UserRegister')) {
      setCredential('')
      setPassword('')
    }
  }, [contextApp.dialogsArrayAction.exist('UserRegister')])

  const Component =
    <>
      <Dialog open={contextApp.dialogsArrayAction.exist('UserRegister')} onClose={() => contextApp.dialogsArrayAction.remove('UserRegister')} sx={{ '& .MuiDialog-paper': { width: 600, maxWidth: 'unset' } }}>
        <DialogTitle>
          <Typography color='primary' style={{ fontSize: 20 }}>注册</Typography>
        </DialogTitle>
        <DialogContent style={{ paddingTop: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <TextField fullWidth required autoComplete='off' size='small' label='账号' variant='outlined' value={credential} onChange={e => setCredential(e.target.value)} />
            <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>账号请输入8-32位字母数字</Typography>
            <TextField fullWidth required autoComplete='off' size='small' label='密码' variant='outlined' value={password} onChange={e => setPassword(e.target.value)} />
            <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>密码请输入8-32位字母数字</Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCreateCredential}>随机生成账号</Button>
          <Button onClick={onLogin}>前往登录</Button>
          <Button onClick={onEnsure}>注册</Button>
        </DialogActions>
      </Dialog>
    </>

  return Component
}

export default App