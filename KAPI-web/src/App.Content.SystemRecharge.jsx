import React from 'react'
import * as ReactRouterDom from "react-router-dom"

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import CloseIcon from '@mui/icons-material/Close'

import { Context as ContextApp } from './App'

import { Fetch } from './utils.fetch'

function App() {
  const navigate = ReactRouterDom.useNavigate()

  const contextApp = React.useContext(ContextApp)

  const [userId, setUserId] = React.useState('')
  const [credential, setCredential] = React.useState('')
  const [userCoin, setUserCoin] = React.useState()
  const [userCoinChange, setUserIdChange] = React.useState(0)

  const onSearch = async () => {
    contextApp.loadingArrayAction.add('SystemRecharge')

    await Fetch.json('/api/app/admin/user/find', { user_id: userId || undefined, credential: credential || undefined })
      .then(res => {
        setUserCoin(res.data.coin)
        contextApp.messageArrayAction.add('查询成功')
      })
      .catch(res => {
        contextApp.messageArrayAction.add('查询失败')
      })

    contextApp.loadingArrayAction.remove('SystemRecharge')
  }

  const onEnsure = async () => {
    contextApp.loadingArrayAction.add('SystemRecharge')

    await Fetch.json('/api/app/admin/user/update/coin', { user_id: userId || undefined, credential: credential || undefined, coin: Number(userCoinChange) })
      .then(res => {
        setUserIdChange(0)
        onSearch()
        contextApp.messageArrayAction.add('修改成功')
      })
      .catch(res => {
        contextApp.messageArrayAction.add('修改失败')
      })

    contextApp.loadingArrayAction.remove('SystemRecharge')
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
                <Typography color='primary' style={{ fontSize: 28 }}>充值硬币</Typography>
                <CloseIcon color='primary' style={{ width: 32, height: 32, cursor: 'pointer' }} onClick={onClose} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', gap: 24, paddingTop: 32 }}>
                <TextField required fullWidth autoComplete='off' label='ID' variant='outlined' value={userId} onChange={e => { setUserId(e.target.value); setCredential(''); setUserCoin(); }} disabled={credential !== ''} />
                <TextField required fullWidth autoComplete='off' label='账号' variant='outlined' value={credential} onChange={e => { setUserId(''); setCredential(e.target.value); setUserCoin(); }} disabled={userId !== ''} />
                {
                  userCoin !== undefined ?
                    <>
                      <TextField required fullWidth autoComplete='off' label='当前拥有的硬币' variant='outlined' type='number' value={userCoin} disabled />
                      <TextField required fullWidth autoComplete='off' label='配置增加的硬币' variant='outlined' type='number' value={userCoinChange} onChange={e => setUserIdChange(e.target.value)} />
                    </>
                    : null
                }
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
                  <Button variant='contained' onClick={onSearch} disabled={userId === '' && credential === ''}>查询</Button>
                  <Button variant='contained' onClick={onEnsure} disabled={userCoin === undefined}>修改</Button>
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