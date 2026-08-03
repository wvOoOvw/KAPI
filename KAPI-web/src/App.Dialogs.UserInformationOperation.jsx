import React from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'

import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'

import Image from './App.ComponentPure.Image'

import { Context as ContextApp } from './App'

import { Fetch } from './utils.fetch'
import { upload } from './utils.upload'
import { random } from './utils.random'

function App() {
  const contextApp = React.useContext(ContextApp)

  const [user, setUser] = React.useState()
  const [userLoading, setUserLoading] = React.useState(false)

  const onFetchUser = async () => {
    setUserLoading(true)

    await Fetch.json('/api/app/user/find', { user_id: contextApp.user._id })
      .then(res => {
        setUser({ credential: res.data.credential, password: res.data.password, name: res.data.name, description: res.data.description, avatar: res.data.avatar, background: res.data.background })
      })
      .catch(res => {
        contextApp.dialogsArrayAction.remove('UserInformationOperation')
        contextApp.messageArrayAction.add('查询错误')
      })

    setUserLoading(false)
  }

  const onEnsure = async () => {
    contextApp.loadingArrayAction.add('UserInformationOperation')

    await Fetch.json('/api/app/user/update', { ...user })
      .then(res => {
        localStorage.setItem('User_Authorization', res.data.authorization)
        Fetch.connect(res.data.authorization)
        contextApp.setUser(res.data)
        contextApp.messageArrayAction.add('编辑成功')
        contextApp.dialogsArrayAction.remove('UserInformationOperation')
      })
      .catch(res => {
        contextApp.messageArrayAction.add(res.message || '异常错误')
      })

    if (contextApp.dialogsArrayAction.props('UserInformationOperation') && contextApp.dialogsArrayAction.props('UserInformationOperation').onRefresh) {
      await contextApp.dialogsArrayAction.props('UserInformationOperation').onRefresh()
    }

    contextApp.loadingArrayAction.remove('UserInformationOperation')
  }

  const onUpdateAvatar = async (e) => {
    contextApp.loadingArrayAction.add('Upload')

    await upload(e.target.files[0], '/static/user/' + user._id, random(12, 1, 'toLowerCase'))
      .then(res => {
        setUser({ ...user, avatar: res.data })
      })
      .catch(res => {
        contextApp.messageArrayAction.add(res?.message || '上传失败')
      })

    contextApp.loadingArrayAction.remove('Upload')
  }

  const onUpdateBackground = async (e) => {
    contextApp.loadingArrayAction.add('Upload')

    await upload(e.target.files[0], '/static/user/' + user._id, random(12, 1, 'toLowerCase'))
      .then(res => {
        setUser({ ...user, background: res.data })
      })
      .catch(res => {
        contextApp.messageArrayAction.add(res?.message || '上传失败')
      })

    contextApp.loadingArrayAction.remove('Upload')
  }

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('UserInformationOperation')) {
      setUser()
      setUserLoading(false)
      onFetchUser()
    }
  }, [contextApp.dialogsArrayAction.exist('UserInformationOperation')])

  const Component =
    <Dialog open={contextApp.dialogsArrayAction.exist('UserInformationOperation')} onClose={() => contextApp.dialogsArrayAction.remove('UserInformationOperation')} sx={{ '& .MuiDialog-paper': { width: 600, maxWidth: 'unset' } }}>
      <DialogTitle>
        <Typography color='primary' style={{ fontSize: 20 }}>
          编辑资料
        </Typography>
      </DialogTitle>
      <DialogContent style={{ paddingTop: 12 }}>
        {
          userLoading !== true && user ?
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              <Typography color='primary' variant='body2' style={{ fontSize: 12 }}>头像</Typography>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <label style={{ width: 64, height: 64 }}>
                  <input type='file' accept='image/*' style={{ display: 'none' }} onChange={onUpdateAvatar} />
                  <Image
                    lazy
                    src={user.avatar || undefined}
                    mode='Avatar'
                    loadingSize={16}
                    style={{ width: '100%', height: '100%' }}
                  />
                </label>
              </div>

              <Typography color='primary' variant='body2' style={{ fontSize: 12 }}>背景图</Typography>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <label style={{ width: '100%', maxWidth: 320, aspectRatio: '2 / 1' }}>
                  <input type='file' accept='image/*' style={{ display: 'none' }} onChange={onUpdateBackground} />
                  {
                    user.background !== '' ?
                      <Image
                        lazy
                        card
                        src={user.background}
                        mode='BackgroundCover'
                        loadingSize={32}
                        style={{ width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden' }}
                      />
                      : null
                  }
                  {
                    user.background === '' ?
                      <Card style={{ width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden' }}>
                        <CardActionArea style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} component='div'>
                          <AddAPhotoIcon />
                        </CardActionArea>
                      </Card>
                      : null
                  }
                </label>
              </div>

              <TextField fullWidth autoComplete='off' label='账号' variant='standard' value={user.credential} onChange={e => setUser({ ...user, credential: e.target.value })} />
              <TextField fullWidth autoComplete='off' label='密码' variant='standard' value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} />
              <TextField fullWidth autoComplete='off' label='名字' variant='standard' value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} />
              <TextField fullWidth multiline autoComplete='off' label='个人描述' variant='standard' value={user.description} onChange={e => setUser({ ...user, description: e.target.value })} />

            </div>
            : null
        }
        {
          userLoading === true ?
            <div style={{ width: '100%', height: 120, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress color='primary' size={32} />
            </div>
            : null
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={() => contextApp.dialogsArrayAction.remove('UserInformationOperation')}>取消</Button>
        <Button onClick={onEnsure}>确认修改</Button>
      </DialogActions>
    </Dialog>

  return Component
}

export default App