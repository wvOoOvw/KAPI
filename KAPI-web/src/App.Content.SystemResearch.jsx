import React from 'react'
import * as ReactRouterDom from "react-router-dom"

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import CloseIcon from '@mui/icons-material/Close'
import CopyAllIcon from '@mui/icons-material/CopyAll'

import { Context as ContextApp } from './App'

import { Fetch } from './utils.fetch'
import { copy } from './utils.copy'

function App() {
  const navigate = ReactRouterDom.useNavigate()

  const contextApp = React.useContext(ContextApp)

  const [userId, setUserId] = React.useState('')
  const [credential, setCredential] = React.useState('')
  const [userCredential, setUserCredential] = React.useState()
  const [userPassword, setUserPassword] = React.useState()

  const onSearch = async () => {
    contextApp.loadingArrayAction.add('SystemResearch')

    await Fetch.json('/api/app/admin/user/find', { user_id: userId || undefined, credential: credential || undefined })
      .then(res => {
        setUserCredential(res.data.credential)
        setUserPassword(res.data.password)
        contextApp.messageArrayAction.add('查询成功')
      })
      .catch(res => {
        contextApp.messageArrayAction.add('查询失败')
      })

    contextApp.loadingArrayAction.remove('SystemResearch')
  }

  const onCopy = async () => {
    await copy(`账号：${userCredential}\n密码：${userPassword}`)
      .then(() => {
        contextApp.messageArrayAction.add('已复制到剪贴板')
      })
      .catch(() => {
        contextApp.messageArrayAction.add('复制失败')
      })
  }

  const onClose = () => {
    if (document.referrer === '') navigate('/')
    if (document.referrer !== '') navigate(-1)
  }

  const Component =
    <>
      {
        contextApp.user && contextApp.user.role === 'admin' ?
          <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', padding: 24 }}>
            <div style={{ width: '100%', maxWidth: 880, height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <Typography color='primary' style={{ fontSize: 28 }}>查询账号</Typography>
                <CloseIcon color='primary' style={{ width: 32, height: 32, cursor: 'pointer' }} onClick={onClose} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', gap: 24, paddingTop: 32 }}>
                <TextField required fullWidth autoComplete='off' label='ID' variant='outlined' value={userId} onChange={e => { setUserId(e.target.value); setCredential(''); setUserCredential(); setUserPassword(); }} disabled={credential !== ''} />
                <TextField required fullWidth autoComplete='off' label='账号' variant='outlined' value={credential} onChange={e => { setUserId(''); setCredential(e.target.value); setUserCredential(); setUserPassword(); }} disabled={userId !== ''} />
                {
                  userCredential !== undefined && userPassword !== undefined ?
                    <>
                      <TextField required fullWidth autoComplete='off' label='查询账号' variant='outlined' value={userCredential} />
                      <TextField required fullWidth autoComplete='off' label='查询密码' variant='outlined' value={userPassword} />
                    </>
                    : null
                }
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
                  <Button variant='contained' onClick={onSearch} disabled={userId === '' && credential === ''}>查询</Button>
                  <Button variant='contained' onClick={onCopy} disabled={userCredential === undefined || userPassword === undefined}>复制</Button>
                </div>
              </div>
            </div>
          </div>
          : null
      }
    </>

  return Component
}

export default App