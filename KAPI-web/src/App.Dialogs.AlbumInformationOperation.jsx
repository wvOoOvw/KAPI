import React from 'react'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

import DeleteIcon from '@mui/icons-material/Delete'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import AddIcon from '@mui/icons-material/Add'
import CopyAllIcon from '@mui/icons-material/CopyAll'

import Image from './App.ComponentPure.Image'
import ImageAction from './App.Component.ImageAction'

import { Context as ContextApp } from './App'

import { Fetch } from './utils.fetch'
import { upload } from './utils.upload'

function StepName(props) {
  const album = props.album
  const setAlbum = props.setAlbum

  const Component =
    <>
      <TextField fullWidth autoComplete='off' label='名称' variant='standard' value={album.name} onChange={e => setAlbum({ ...album, name: e.target.value })} />
    </>

  return Component
}

function StepDescription(props) {
  const album = props.album
  const setAlbum = props.setAlbum

  const Component =
    <>
      <TextField fullWidth multiline autoComplete='off' label='描述' variant='standard' value={album.description} onChange={e => setAlbum({ ...album, description: e.target.value })} />
    </>

  return Component
}

function StepTag(props) {
  const album = props.album
  const setAlbum = props.setAlbum
  const optionTag = props.optionTag

  const contextApp = React.useContext(ContextApp)

  const [add, setAdd] = React.useState('')

  const onDelete = (tag) => {
    setAlbum(i => ({ ...i, tag: i.tag.filter(n => n !== tag) }))
  }

  const onAdd = () => {
    if (album.tag.includes(add)) {
      return contextApp.messageArrayAction.add('无法重复添加')
    }
    if (add === '') {
      return contextApp.messageArrayAction.add('无法添加空标签')
    }
    setAlbum(i => ({ ...i, tag: [...i.tag, add] }))
    setAdd('')
  }

  const Component =
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 12 }}>
        {
          album.tag.map((i, index) => {
            return <Chip
              key={index}
              variant='outlined'
              onDelete={() => onDelete(i)}
              label={<Typography variant='body2' style={{ lineHeight: 1 }}>{i}</Typography>}
            />
          })
        }
        <Chip
          sx={{ '&.Mui-focusVisible': { background: 'none' } }}
          variant='outlined'
          onDelete={() => onAdd()}
          deleteIcon={<AddCircleRoundedIcon />}
          label={<input placeholder='添加' style={{ border: 'none', outline: 'none', width: 80 }} value={add} onChange={e => setAdd(e.target.value)} />}
        />
      </div>
      <div style={{ maxWidth: '100%', display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 16 }}>
        {
          optionTag.map(i => <Button key={i.tag} style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 12 }} variant='text' onClick={() => setAlbum(n => ({ ...n, tag: [...n.tag, i.tag] }))}>{i.tag}</Button>)
        }
      </div>
    </div>

  return Component
}

function StepActor(props) {
  const album = props.album
  const setAlbum = props.setAlbum
  const optionActor = props.optionActor

  const contextApp = React.useContext(ContextApp)

  const [add, setAdd] = React.useState('')

  const onDelete = (actor) => {
    setAlbum(i => ({ ...i, actor: i.actor.filter(n => n !== actor) }))
  }

  const onAdd = () => {
    if (album.actor.includes(add)) {
      return contextApp.messageArrayAction.add('无法重复添加')
    }
    if (add === '') {
      return contextApp.messageArrayAction.add('无法添加空标签')
    }
    setAlbum(i => ({ ...i, actor: [...i.actor, add] }))
    setAdd('')
  }

  const Component =
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 12 }}>
        {
          album.actor.map((i, index) => {
            return <Chip
              key={index}
              variant='outlined'
              onDelete={() => onDelete(i)}
              label={<Typography variant='body2' style={{ lineHeight: 1 }}>{i}</Typography>}
            />
          })
        }
        <Chip
          sx={{ '&.Mui-focusVisible': { background: 'none' } }}
          variant='outlined'
          onDelete={() => onAdd()}
          deleteIcon={<AddCircleRoundedIcon />}
          label={<input placeholder='添加' style={{ border: 'none', outline: 'none', width: 80 }} value={add} onChange={e => setAdd(e.target.value)} />}
        />
      </div>
      <div style={{ maxWidth: '100%', display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 16 }}>
        {
          optionActor.map(i => <Button key={i.actor} style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 12 }} variant='text' onClick={() => setAlbum(n => ({ ...n, actor: [...n.actor, i.actor] }))}>{i.actor}</Button>)
        }
      </div>
    </div>

  return Component
}

function StepPrice(props) {
  const album = props.album
  const setAlbum = props.setAlbum

  const contextApp = React.useContext(ContextApp)

  const Component =
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <TextField fullWidth type='number' autoComplete='off' label='定价' variant='standard' value={album.price} onChange={e => setAlbum({ ...album, price: e.target.value })} />

      <div style={{ display: 'flex' }}>
        {
          [20, 40, 60, 80, 100].map((i, index) => {
            return <Button key={index} style={{ minWidth: 'unset', padding: '4px 12px', fontSize: 12 }} onClick={() => setAlbum({ ...album, price: i })} >{i}</Button>
          })
        }
      </div>
    </div>

  return Component
}

function StepPoster(props) {
  const album = props.album
  const setAlbum = props.setAlbum

  const contextApp = React.useContext(ContextApp)

  const Component =
    <>
      <ImageAction
        mode='Poster'
        value={album.poster}
        onChange={value => setAlbum({ ...album, poster: value })}
      />
    </>

  return Component
}

function StepPreview(props) {
  const album = props.album
  const setAlbum = props.setAlbum

  const Component = <ImageAction value={album.preview} onChange={value => setAlbum({ ...album, preview: value })} />

  return Component
}

function StepPaidContent(props) {
  const album = props.album
  const setAlbum = props.setAlbum

  const Component =
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 12, width: '100%' }}>
      <FormControl fullWidth size='small' variant='standard'>
        <InputLabel>下载模式</InputLabel>
        <Select color='primary' variant='standard' size='small' label='下载模式' value={album.paidContent.downloadMode} onChange={() => setAlbum({ ...album, paidContent: { downloadMode: e.target.value, downloadContent: [] } })}>
          <MenuItem value='Internal' style={{ fontSize: 14, padding: 8, minHeight: 'auto' }}>站内下载</MenuItem>
          <MenuItem value='External' style={{ fontSize: 14, padding: 8, minHeight: 'auto' }}>站外下载</MenuItem>
        </Select>
      </FormControl>
      {
        album.paidContent.downloadMode === 'Internal' && (
          <>
            <ImageAction value={album.paidContent.downloadContent.map(i => i.downloadFileLink)} onChange={value => setAlbum(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: value.map((i) => ({ downloadFileType: 'Image', downloadFileLink: i })) } }))} />
          </>
        )
      }
      {
        album.paidContent.downloadMode === 'External' ?
          <>
            <Button style={{ marginTop: 8 }} variant='contained' startIcon={<AddIcon />} onClick={() => setAlbum(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: [...i.paidContent.downloadContent, { downloadExternalChannel: 'BaiduDisk', downloadExternalLink: '', downloadExternalLinkPassword: '', needCompress: false, compressMode: '7Z', compressPassword: '' }] } }))}>
              添加内容
            </Button>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              {
                album.paidContent.downloadContent?.map((item, index) => (
                  <Card key={index} style={{ padding: 16 }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <FormControl style={{ width: '150px' }} size='small' variant='standard'>
                        <InputLabel>渠道</InputLabel>
                        <Select color='primary' variant='standard' size='small' label='渠道' value={item.downloadExternalChannel} onChange={e => setAlbum(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: i.paidContent.downloadContent.map((n, nindex) => nindex === index ? { ...n, downloadExternalChannel: e.target.value } : n) } }))}>
                          <MenuItem value='BaiduDisk' style={{ fontSize: 14, padding: 8, minHeight: 'auto' }}>百度网盘</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField style={{ flexGrow: 1 }} size='small' autoComplete='off' label='下载链接' variant='standard' value={item.downloadExternalLink} onChange={e => setAlbum(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: i.paidContent.downloadContent.map((n, nindex) => nindex === index ? { ...n, downloadExternalLink: e.target.value } : n) } }))} />
                      <TextField style={{ width: '120px' }} size='small' autoComplete='off' label='链接密码' variant='standard' value={item.downloadExternalLinkPassword} onChange={e => setAlbum(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: i.paidContent.downloadContent.map((n, nindex) => nindex === index ? { ...n, downloadExternalLinkPassword: e.target.value } : n) } }))} />
                    </div>

                    <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Typography variant='body2' style={{ fontSize: 14 }}>需要解压</Typography>
                        <Switch checked={item.needCompress} onChange={(e, v) => setAlbum(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: i.paidContent.downloadContent.map((n, nindex) => nindex === index ? { ...n, needCompress: v } : n) } }))} />
                      </div>

                      {item.needCompress && (
                        <>
                          <FormControl style={{ width: '100px' }} size='small' variant='standard'>
                            <InputLabel>解压格式</InputLabel>
                            <Select color='primary' variant='standard' size='small' label='解压格式' value={item.compressMode} onChange={e => setAlbum(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: i.paidContent.downloadContent.map((n, nindex) => nindex === index ? { ...n, compressMode: e.target.value } : n) } }))}>
                              <MenuItem value='7Z' style={{ fontSize: 14, padding: 8, minHeight: 'auto' }}>7Z</MenuItem>
                              <MenuItem value='ZIP' style={{ fontSize: 14, padding: 8, minHeight: 'auto' }}>ZIP</MenuItem>
                            </Select>
                          </FormControl>
                          <TextField style={{ width: '150px' }} size='small' autoComplete='off' label='解压密码' variant='standard' value={item.compressPassword} onChange={e => setAlbum(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: i.paidContent.downloadContent.map((n, nindex) => nindex === index ? { ...n, compressPassword: e.target.value } : n) } }))} />
                        </>
                      )}

                      <IconButton color='error' onClick={() => setAlbum(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: i.paidContent.downloadContent.filter((n, nindex) => nindex !== index) } }))} style={{ marginLeft: 'auto' }}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </Card>
                ))
              }
            </div>
          </>
          : null
      }
    </div>

  return Component
}

function StepSetting(props) {
  const album = props.album
  const setAlbum = props.setAlbum

  const Component =
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography color='primary' variant='body2' style={{ fontSize: 16 }}>是否上架</Typography>
          <Switch checked={album.status === 1} onChange={(e, v) => setAlbum(({ ...album, status: v ? 1 : 0 }))} />
        </div>
      </div>
    </>

  return Component
}

function App() {
  const contextApp = React.useContext(ContextApp)

  const [album, setAlbum] = React.useState({ name: '', description: '', tag: [], actor: [], price: 0, poster: [], preview: [], paidContent: [], status: 1 })
  const [albumLoading, setAlbumLoading] = React.useState(false)

  const [optionTag, setOptionTag] = React.useState([])
  const [optionActor, setOptionActor] = React.useState([])

  const [step, setStep] = React.useState(0)

  const onFetchOption = async () => {
    await Fetch.json('/api/app/album/find/tag', { match: '' }).then(res => setOptionTag(res.data))
    await Fetch.json('/api/app/album/find/actor', { match: '' }).then(res => setOptionActor(res.data))
  }

  const onFetchAlbum = async () => {
    setAlbumLoading(true)

    await Fetch.json('/api/app/album/find', { album_id: contextApp.dialogsArrayAction.props('AlbumInformationOperation')._id })
      .then(res => {
        setAlbum({ name: res.data.name, description: res.data.description, tag: res.data.tag, actor: res.data.actor, price: res.data.price, poster: res.data.poster, preview: res.data.preview, paidContent: res.data.paidContent, status: res.data.status })
      })
      .catch(res => {
        contextApp.dialogsArrayAction.remove('AlbumInformationOperation')
        contextApp.messageArrayAction.add('查询错误')
      })

    setAlbumLoading(false)
  }

  const onUpdate = async () => {
    contextApp.loadingArrayAction.add('AlbumInformationOperation')

    if (contextApp.dialogsArrayAction.props('AlbumInformationOperation') !== undefined) {
      await Fetch.json('/api/app/album/update', { ...album, price: Number(album.price), album_id: contextApp.dialogsArrayAction.props('AlbumInformationOperation')._id, _id: undefined })
        .then(res => {
          contextApp.dialogsArrayAction.remove('AlbumInformationOperation')
          contextApp.messageArrayAction.add('更新成功')
        })
        .catch(res => {
          contextApp.messageArrayAction.add(res.message || '系统异常')
        })
    }

    if (contextApp.dialogsArrayAction.props('AlbumInformationOperation') === undefined) {
      await Fetch.json('/api/app/album/insert', { ...album, price: Number(album.price) })
        .then(res => {
          contextApp.dialogsArrayAction.remove('AlbumInformationOperation')
          contextApp.messageArrayAction.add('创建成功')
        })
        .catch(res => {
          contextApp.messageArrayAction.add(res.message || '系统异常')
        })
    }

    if (contextApp.dialogsArrayAction.props('AlbumInformationOperation') && contextApp.dialogsArrayAction.props('AlbumInformationOperation').onRefresh) {
      await contextApp.dialogsArrayAction.props('AlbumInformationOperation').onRefresh()
    }

    contextApp.loadingArrayAction.remove('AlbumInformationOperation')
  }

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('AlbumInformationOperation')) {
      setStep(0)
      setAlbum({ name: '', description: '', tag: [], actor: [], price: 0, poster: [], preview: [], paidContent: [], status: 1 })
      setAlbumLoading(false)
      onFetchOption()
    }

    if (contextApp.dialogsArrayAction.props('AlbumInformationOperation')) {
      onFetchAlbum()
    }
  }, [contextApp.dialogsArrayAction.exist('AlbumInformationOperation')])

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('AlbumInformationOperation') && document.getElementById('step' + step)) {
      document.getElementById('step' + step).scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }
  }, [contextApp.dialogsArrayAction.exist('AlbumInformationOperation'), step])

  const Component =
    <Dialog open={contextApp.dialogsArrayAction.exist('AlbumInformationOperation')} onClose={() => contextApp.dialogsArrayAction.remove('AlbumInformationOperation')} sx={{ '& .MuiDialog-paper': { width: 600, maxWidth: 'unset' } }}>
      <DialogTitle>
        <Typography color='primary' style={{ fontSize: 20 }}>
          {
            contextApp.dialogsArrayAction.props('AlbumInformationOperation') !== undefined ? '修改图集' : null
          }
          {
            contextApp.dialogsArrayAction.props('AlbumInformationOperation') === undefined ? '创建图集' : null
          }
        </Typography>
      </DialogTitle>
      <DialogContent style={{ paddingTop: 12 }}>
        {
          albumLoading !== true ?
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Stepper alternativeLabel activeStep={step} style={{ overflow: 'auto', flexShrink: 0 }}>
                {
                  ['名称', '描述', '标签', '演员', '定价', '封面', '预览', '解锁内容', '设置'].map((i, index) => {
                    return <Step key={index} style={{ minWidth: 80 }} id={'step' + index}>
                      <StepLabel style={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => setStep(index)}>{i}</StepLabel>
                    </Step>
                  })
                }
              </Stepper>
              {step === 0 ? <StepName album={album} setAlbum={setAlbum} optionTag={optionTag} optionActor={optionActor} /> : null}
              {step === 1 ? <StepDescription album={album} setAlbum={setAlbum} optionTag={optionTag} optionActor={optionActor} /> : null}
              {step === 2 ? <StepTag album={album} setAlbum={setAlbum} optionTag={optionTag} optionActor={optionActor} /> : null}
              {step === 3 ? <StepActor album={album} setAlbum={setAlbum} optionTag={optionTag} optionActor={optionActor} /> : null}
              {step === 4 ? <StepPrice album={album} setAlbum={setAlbum} optionTag={optionTag} optionActor={optionActor} /> : null}
              {step === 5 ? <StepPoster album={album} setAlbum={setAlbum} optionTag={optionTag} optionActor={optionActor} /> : null}
              {step === 6 ? <StepPreview album={album} setAlbum={setAlbum} optionTag={optionTag} optionActor={optionActor} /> : null}
              {step === 7 ? <StepPaidContent album={album} setAlbum={setAlbum} optionTag={optionTag} optionActor={optionActor} /> : null}
              {step === 8 ? <StepSetting album={album} setAlbum={setAlbum} optionTag={optionTag} optionActor={optionActor} /> : null}
            </div>
            : null
        }
        {
          albumLoading === true ?
            <div style={{ width: '100%', height: 120, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress color='primary' size={32} />
            </div>
            : null
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setStep(i => i - 1)} disabled={step === 0 || albumLoading}>上一步</Button>
        <Button onClick={() => setStep(i => i + 1)} disabled={step === 8 || albumLoading}>下一步</Button>
        <Button onClick={onUpdate} disabled={albumLoading}>确认</Button>
      </DialogActions>
    </Dialog>

  return Component
}

export default App