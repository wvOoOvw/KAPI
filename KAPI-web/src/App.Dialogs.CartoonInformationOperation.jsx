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
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Switch from '@mui/material/Switch'

import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import AddIcon from '@mui/icons-material/Add'

import Image from './App.ComponentPure.Image'
import ImageAction from './App.Component.ImageAction'

import { Context as ContextApp } from './App'

import { Fetch } from './utils.fetch'

function StepName(props) {
  const cartoon = props.cartoon
  const setCartoon = props.setCartoon

  const Component =
    <>
      <TextField fullWidth autoComplete='off' label='名称' variant='standard' value={cartoon.name} onChange={e => setCartoon({ ...cartoon, name: e.target.value })} />
    </>

  return Component
}

function StepDescription(props) {
  const cartoon = props.cartoon
  const setCartoon = props.setCartoon

  const Component =
    <>
      <TextField fullWidth multiline autoComplete='off' label='描述' variant='standard' value={cartoon.description} onChange={e => setCartoon({ ...cartoon, description: e.target.value })} />
    </>

  return Component
}

function StepTag(props) {
  const cartoon = props.cartoon
  const setCartoon = props.setCartoon
  const optionTag = props.optionTag

  const contextApp = React.useContext(ContextApp)

  const [add, setAdd] = React.useState('')

  const onDelete = (tag) => {
    setCartoon(i => ({ ...i, tag: i.tag.filter(n => n !== tag) }))
  }

  const onAdd = () => {
    if (cartoon.tag.includes(add)) {
      return contextApp.messageArrayAction.add('无法重复添加')
    }
    if (add === '') {
      return contextApp.messageArrayAction.add('无法添加空标签')
    }
    setCartoon(i => ({ ...i, tag: [...i.tag, add] }))
    setAdd('')
  }

  const Component =
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 12 }}>
        {
          cartoon.tag.map((i, index) => {
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
          optionTag.map(i => <Button key={i.tag} style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 12 }} variant='text' onClick={() => setCartoon(n => ({ ...n, tag: [...n.tag, i.tag] }))}>{i.tag}</Button>)
        }
      </div>
    </div>

  return Component
}

function StepActor(props) {
  const cartoon = props.cartoon
  const setCartoon = props.setCartoon
  const optionActor = props.optionActor

  const contextApp = React.useContext(ContextApp)

  const [add, setAdd] = React.useState('')

  const onDelete = (actor) => {
    setCartoon(i => ({ ...i, actor: i.actor.filter(n => n !== actor) }))
  }

  const onAdd = () => {
    if (cartoon.actor.includes(add)) {
      return contextApp.messageArrayAction.add('无法重复添加')
    }
    if (add === '') {
      return contextApp.messageArrayAction.add('无法添加空标签')
    }
    setCartoon(i => ({ ...i, actor: [...i.actor, add] }))
    setAdd('')
  }

  const Component =
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 12 }}>
        {
          cartoon.actor.map((i, index) => {
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
          optionActor.map(i => <Button key={i.actor} style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 12 }} variant='text' onClick={() => setCartoon(n => ({ ...n, actor: [...n.actor, i.actor] }))}>{i.actor}</Button>)
        }
      </div>
    </div>

  return Component
}

function StepPrice(props) {
  const cartoon = props.cartoon
  const setCartoon = props.setCartoon

  const contextApp = React.useContext(ContextApp)

  const Component =
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <TextField fullWidth type='number' autoComplete='off' label='定价' variant='standard' value={cartoon.price} onChange={e => setCartoon({ ...cartoon, price: e.target.value })} />

      <div style={{ display: 'flex' }}>
        {
          [20, 40, 60, 80, 100].map((i, index) => {
            return <Button key={index} style={{ minWidth: 'unset', padding: '4px 12px', fontSize: 12 }} onClick={() => setCartoon({ ...cartoon, price: i })} >{i}</Button>
          })
        }
      </div>
    </div>

  return Component
}

function StepPoster(props) {
  const cartoon = props.cartoon
  const setCartoon = props.setCartoon

  const contextApp = React.useContext(ContextApp)

  const Component = <ImageAction value={cartoon.poster} onChange={value => setCartoon({ ...cartoon, poster: value })} />

  return Component
}

function StepPreview(props) {
  const cartoon = props.cartoon
  const setCartoon = props.setCartoon

  const Component = <ImageAction value={cartoon.preview} onChange={value => setCartoon({ ...cartoon, preview: value })} />

  return Component
}

function StepPaidContent(props) {
  const cartoon = props.cartoon
  const setCartoon = props.setCartoon

  const Component =
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 12, width: '100%' }}>
      <FormControl fullWidth size='small' variant='standard'>
        <InputLabel>下载模式</InputLabel>
        <Select color='primary' variant='standard' size='small' label='下载模式' value={cartoon.paidContent.downloadMode} onChange={() => setCartoon({ ...cartoon, paidContent: { downloadMode: e.target.value, downloadContent: [] } })}>
          <MenuItem value='Internal' style={{ fontSize: 14, padding: 8, minHeight: 'auto' }}>站内下载</MenuItem>
          <MenuItem value='External' style={{ fontSize: 14, padding: 8, minHeight: 'auto' }}>站外下载</MenuItem>
        </Select>
      </FormControl>
      {
        cartoon.paidContent.downloadMode === 'Internal' && (
          <>
            <ImageAction value={cartoon.paidContent.downloadContent.map(i => i.downloadFileLink)} onChange={value => setCartoon(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: value.map((i) => ({ downloadFileType: 'Image', downloadFileLink: i })) } }))} />
          </>
        )
      }
      {
        cartoon.paidContent.downloadMode === 'External' ?
          <>
            <Button style={{ marginTop: 8 }} variant='contained' startIcon={<AddIcon />} onClick={() => setCartoon(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: [...i.paidContent.downloadContent, { downloadExternalChannel: 'BaiduDisk', downloadExternalLink: '', downloadExternalLinkPassword: '', needCompress: false, compressMode: '7Z', compressPassword: '' }] } }))}>
              添加内容
            </Button>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              {
                cartoon.paidContent.downloadContent?.map((item, index) => (
                  <Card key={index} style={{ padding: 16 }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <FormControl style={{ width: '150px' }} size='small' variant='standard'>
                        <InputLabel>渠道</InputLabel>
                        <Select color='primary' variant='standard' size='small' label='渠道' value={item.downloadExternalChannel} onChange={e => setCartoon(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: i.paidContent.downloadContent.map((n, nindex) => nindex === index ? { ...n, downloadExternalChannel: e.target.value } : n) } }))}>
                          <MenuItem value='BaiduDisk' style={{ fontSize: 14, padding: 8, minHeight: 'auto' }}>百度网盘</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField style={{ flexGrow: 1 }} size='small' autoComplete='off' label='下载链接' variant='standard' value={item.downloadExternalLink} onChange={e => setCartoon(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: i.paidContent.downloadContent.map((n, nindex) => nindex === index ? { ...n, downloadExternalLink: e.target.value } : n) } }))} />
                      <TextField style={{ width: '120px' }} size='small' autoComplete='off' label='链接密码' variant='standard' value={item.downloadExternalLinkPassword} onChange={e => setCartoon(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: i.paidContent.downloadContent.map((n, nindex) => nindex === index ? { ...n, downloadExternalLinkPassword: e.target.value } : n) } }))} />
                    </div>

                    <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Typography variant='body2' style={{ fontSize: 14 }}>需要解压</Typography>
                        <Switch checked={item.needCompress} onChange={(e, v) => setCartoon(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: i.paidContent.downloadContent.map((n, nindex) => nindex === index ? { ...n, needCompress: v } : n) } }))} />
                      </div>

                      {item.needCompress && (
                        <>
                          <FormControl style={{ width: '100px' }} size='small' variant='standard'>
                            <InputLabel>解压格式</InputLabel>
                            <Select color='primary' variant='standard' size='small' label='解压格式' value={item.compressMode} onChange={e => setCartoon(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: i.paidContent.downloadContent.map((n, nindex) => nindex === index ? { ...n, compressMode: e.target.value } : n) } }))}>
                              <MenuItem value='7Z' style={{ fontSize: 14, padding: 8, minHeight: 'auto' }}>7Z</MenuItem>
                              <MenuItem value='ZIP' style={{ fontSize: 14, padding: 8, minHeight: 'auto' }}>ZIP</MenuItem>
                            </Select>
                          </FormControl>
                          <TextField style={{ width: '150px' }} size='small' autoComplete='off' label='解压密码' variant='standard' value={item.compressPassword} onChange={e => setCartoon(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: i.paidContent.downloadContent.map((n, nindex) => nindex === index ? { ...n, compressPassword: e.target.value } : n) } }))} />
                        </>
                      )}

                      <IconButton color='error' onClick={() => setCartoon(i => ({ ...i, paidContent: { ...i.paidContent, downloadContent: i.paidContent.downloadContent.filter((n, nindex) => nindex !== index) } }))} style={{ marginLeft: 'auto' }}>
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
  const cartoon = props.cartoon
  const setCartoon = props.setCartoon

  const Component =
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography color='primary' variant='body2' style={{ fontSize: 16 }}>是否上架</Typography>
          <Switch checked={cartoon.status === 1} onChange={(e, v) => setCartoon(({ ...cartoon, status: v ? 1 : 0 }))} />
        </div>
      </div>
    </>

  return Component
}

function App() {
  const contextApp = React.useContext(ContextApp)

  const [cartoon, setCartoon] = React.useState({ name: '', description: '', tag: [], actor: [], price: 0, poster: [], preview: [], paidContent: [], status: 1 })
  const [cartoonLoading, setCartoonLoading] = React.useState(false)

  const [optionTag, setOptionTag] = React.useState([])
  const [optionActor, setOptionActor] = React.useState([])

  const [step, setStep] = React.useState(0)

  const onFetchOption = async () => {
    await Fetch.json('/api/app/cartoon/find/tag', { match: '' }).then(res => setOptionTag(res.data))
    await Fetch.json('/api/app/cartoon/find/actor', { match: '' }).then(res => setOptionActor(res.data))
  }

  const onFetchCartoon = async () => {
    setCartoonLoading(true)

    await Fetch.json('/api/app/cartoon/find', { cartoon_id: contextApp.dialogsArrayAction.props('CartoonInformationOperation')._id })
      .then(res => {
        setCartoon({ name: res.data.name, description: res.data.description, tag: res.data.tag, actor: res.data.actor, price: res.data.price, poster: res.data.poster, preview: res.data.preview, paidContent: res.data.paidContent, status: res.data.status })
      })
      .catch(res => {
        contextApp.dialogsArrayAction.remove('CartoonInformationOperation')
        contextApp.messageArrayAction.add('查询错误')
      })

    setCartoonLoading(false)
  }

  const onUpdate = async () => {
    contextApp.loadingArrayAction.add('CartoonInformationOperation')

    if (contextApp.dialogsArrayAction.props('CartoonInformationOperation') !== undefined) {
      await Fetch.json('/api/app/cartoon/update', { ...cartoon, price: Number(cartoon.price), cartoon_id: contextApp.dialogsArrayAction.props('CartoonInformationOperation')._id, _id: undefined })
        .then(res => {
          contextApp.dialogsArrayAction.remove('CartoonInformationOperation')
          contextApp.messageArrayAction.add('更新成功')
        })
        .catch(res => {
          contextApp.messageArrayAction.add(res.message || '系统异常')
        })
    }

    if (contextApp.dialogsArrayAction.props('CartoonInformationOperation') === undefined) {
      await Fetch.json('/api/app/cartoon/insert', { ...cartoon, price: Number(cartoon.price) })
        .then(res => {
          contextApp.dialogsArrayAction.remove('CartoonInformationOperation')
          contextApp.messageArrayAction.add('创建成功')
        })
        .catch(res => {
          contextApp.messageArrayAction.add(res.message || '系统异常')
        })
    }

    if (contextApp.dialogsArrayAction.props('CartoonInformationOperation') && contextApp.dialogsArrayAction.props('CartoonInformationOperation').onRefresh) {
      await contextApp.dialogsArrayAction.props('CartoonInformationOperation').onRefresh()
    }

    contextApp.loadingArrayAction.remove('CartoonInformationOperation')
  }

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('CartoonInformationOperation')) {
      setStep(0)
      setCartoon({ name: '', description: '', tag: [], actor: [], price: 0, poster: [], preview: [], paidContent: [], status: 1 })
      setCartoonLoading(false)
      onFetchOption()
    }

    if (contextApp.dialogsArrayAction.props('CartoonInformationOperation')) {
      onFetchCartoon()
    }
  }, [contextApp.dialogsArrayAction.exist('CartoonInformationOperation')])

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('CartoonInformationOperation') && document.getElementById('step' + step)) {
      document.getElementById('step' + step).scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }
  }, [contextApp.dialogsArrayAction.exist('CartoonInformationOperation'), step])

  const Component =
    <Dialog open={contextApp.dialogsArrayAction.exist('CartoonInformationOperation')} onClose={() => contextApp.dialogsArrayAction.remove('CartoonInformationOperation')} sx={{ '& .MuiDialog-paper': { width: 600, maxWidth: 'unset' } }}>
      <DialogTitle>
        <Typography color='primary' style={{ fontSize: 20 }}>
          {
            contextApp.dialogsArrayAction.props('CartoonInformationOperation') !== undefined ? '修改图集' : null
          }
          {
            contextApp.dialogsArrayAction.props('CartoonInformationOperation') === undefined ? '创建图集' : null
          }
        </Typography>
      </DialogTitle>
      <DialogContent style={{ paddingTop: 12 }}>
        {
          cartoonLoading !== true ?
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
              {step === 0 ? <StepName cartoon={cartoon} setCartoon={setCartoon} optionTag={optionTag} optionActor={optionActor} /> : null}
              {step === 1 ? <StepDescription cartoon={cartoon} setCartoon={setCartoon} optionTag={optionTag} optionActor={optionActor} /> : null}
              {step === 2 ? <StepTag cartoon={cartoon} setCartoon={setCartoon} optionTag={optionTag} optionActor={optionActor} /> : null}
              {step === 3 ? <StepActor cartoon={cartoon} setCartoon={setCartoon} optionTag={optionTag} optionActor={optionActor} /> : null}
              {step === 4 ? <StepPrice cartoon={cartoon} setCartoon={setCartoon} optionTag={optionTag} optionActor={optionActor} /> : null}
              {step === 5 ? <StepPoster cartoon={cartoon} setCartoon={setCartoon} optionTag={optionTag} optionActor={optionActor} /> : null}
              {step === 6 ? <StepPreview cartoon={cartoon} setCartoon={setCartoon} optionTag={optionTag} optionActor={optionActor} /> : null}
              {step === 7 ? <StepPaidContent cartoon={cartoon} setCartoon={setCartoon} optionTag={optionTag} optionActor={optionActor} /> : null}
              {step === 8 ? <StepSetting cartoon={cartoon} setCartoon={setCartoon} optionTag={optionTag} optionActor={optionActor} /> : null}
            </div>
            : null
        }
        {
          cartoonLoading === true ?
            <div style={{ width: '100%', height: 120, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress color='primary' size={32} />
            </div>
            : null
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setStep(i => i - 1)} disabled={step === 0 || cartoonLoading}>上一步</Button>
        <Button onClick={() => setStep(i => i + 1)} disabled={step === 8 || cartoonLoading}>下一步</Button>
        <Button onClick={onUpdate} disabled={cartoonLoading}>确认</Button>
      </DialogActions>
    </Dialog>

  return Component
}

export default App