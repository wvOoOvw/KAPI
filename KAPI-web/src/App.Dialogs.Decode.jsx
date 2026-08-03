import React from 'react'

import { ZipReader, BlobReader, BlobWriter, getMimeType } from '@zip.js/zip.js'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Radio from '@mui/material/Radio'

import UploadIcon from '@mui/icons-material/Upload'
import DownloadIcon from '@mui/icons-material/Download'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

import Image from './App.ComponentPure.Image'

import { Context as ContextApp } from './App'

import DecodeIOS_1 from '../static/image/DecodeIOS_1.jpg'
import DecodeIOS_2 from '../static/image/DecodeIOS_2.jpg'
import DecodeIOS_3 from '../static/image/DecodeIOS_3.jpg'
import DecodeIOS_4 from '../static/image/DecodeIOS_4.jpg'
import DecodeIOS_5 from '../static/image/DecodeIOS_5.jpg'
import DecodeIOS_6 from '../static/image/DecodeIOS_6.jpg'

import DecodeAndroid_1 from '../static/image/DecodeAndroid_1.jpg'
import DecodeAndroid_2 from '../static/image/DecodeAndroid_2.jpg'
import DecodeAndroid_3 from '../static/image/DecodeAndroid_3.jpg'
import DecodeAndroid_4 from '../static/image/DecodeAndroid_4.jpg'
import DecodeAndroid_5 from '../static/image/DecodeAndroid_5.jpg'

import { Pagination } from '@mui/material'

function App() {
  const contextApp = React.useContext(ContextApp)

  const [step, setStep] = React.useState(0)
  const [stepTip, setStepTip] = React.useState(0)
  const [downloadFiles, setDownloadFiles] = React.useState([])
  const [device, setDevice] = React.useState(0)
  const [password, setPassword] = React.useState('')

  const onUpload = async (e) => {
    setDownloadFiles([])

    contextApp.loadingArrayAction.add('DecodeUpload')

    const files = e.target.files

    for (let i = 0; i < files.length; i = i + 1) {
      const file = files[i]

      try {
        if (file.name.endsWith('.zip.kapi')) {
          const blobReader = new BlobReader(file)
          const zipReader = new ZipReader(blobReader, { password: password })
          const entries = await zipReader.getEntries()
          const entriesArray = Object.values(entries)
            .filter(i => i.directory !== true)
            .filter(i => i.filename.split('/').pop().startsWith('._') !== true)

          for (let i = 0; i < entriesArray.length; i = i + 1) {
            const entry = entriesArray[i]
            const content = await entry.getData(new BlobWriter())
            const mimeType = getMimeType(entry.filename) || 'application/octet-stream'
            const blob = new Blob([content], { type: mimeType })
            const url = URL.createObjectURL(blob)
            const name = entry.filename.split('/').pop()
            setDownloadFiles(pre => [...pre, { name, url }])
          }

          contextApp.messageArrayAction.add('解压完成')
        }

      } catch (err) {
        console.log(err)
        contextApp.messageArrayAction.add('解压失败')
      }
    }

    contextApp.loadingArrayAction.remove('DecodeUpload')
  }

  const onDownload = (file) => {
    const a = document.createElement('a')
    a.href = file.url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
  }

  const onDownloadAll = async () => {
    contextApp.loadingArrayAction.add('DecodeUpload')

    for (let i = 0; i < downloadFiles.length; i = i + 1) {
      onDownload(downloadFiles[i])
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    contextApp.loadingArrayAction.remove('DecodeUpload')
  }

  const onContact = () => {
    contextApp.dialogsArrayAction.remove('Application').add('Contact', { defaultTab: 1 })
  }

  const onChangeDevice = (v) => {
    setDevice(v)
    setStepTip(0)
  }

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('Decode')) {
      setStep(0)
      setStepTip(0)
      setDownloadFiles([])
      setDevice(0)
      setPassword(contextApp.dialogsArrayAction.props('Decode')?.password || '')
    }
    if (contextApp.dialogsArrayAction.exist('Decode') && contextApp.user === undefined) {
      contextApp.dialogsArrayAction.remove('Decode').add('UserLogin')
      contextApp.messageArrayAction.add('请先登录')
    }
  }, [contextApp.dialogsArrayAction.exist('Decode')])

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('Decode') && document.getElementById('step' + step)) {
      document.getElementById('step' + step).scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }
  }, [contextApp.dialogsArrayAction.exist('Decode'), step])

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('Decode') && downloadFiles.length > 0 && document.getElementById('downloadFilesLast')) {
      document.getElementById('downloadFilesLast').scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }
  }, [contextApp.dialogsArrayAction.exist('Decode'), downloadFiles])

  const Component =
    <Dialog open={contextApp.dialogsArrayAction.exist('Decode')} onClose={() => contextApp.dialogsArrayAction.remove('Decode')} sx={{ '& .MuiDialog-paper': { width: 600, maxWidth: 'unset' } }}>
      <DialogTitle>
        <Typography color='primary' style={{ fontSize: 20 }}>在线解压</Typography>
      </DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 12 }}>

        <Stepper alternativeLabel activeStep={step} style={{ overflow: 'auto', flexShrink: 0, maxWidth: '100%', marginBottom: 12 }}>
          <Step style={{ minWidth: 100 }} id='step0'>
            <StepLabel style={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => setStep(0)}>下载内容</StepLabel>
          </Step>
          <Step style={{ minWidth: 100 }} id='step1'>
            <StepLabel style={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => setStep(1)}>上传解压</StepLabel>
          </Step>
          <Step style={{ minWidth: 100 }} id='step2'>
            <StepLabel style={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => setStep(2)}>图例教程</StepLabel>
          </Step>
        </Stepper>

        {
          step === 0 ?
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, marginBottom: 12, flexShrink: 0 }}>
              <Typography variant='body2' style={{ fontSize: 14 }}>在解锁的图集中，下载网盘内容并保存到本地设备</Typography>
              <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>若已下载并保存完成，点击下一步进行解压</Typography>
            </div>
            : null
        }

        {
          step === 1 ?
            <>
              <Card style={{ width: '100%', maxWidth: 420, flexShrink: 0 }}>
                <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Typography variant='body2' style={{ fontSize: 14 }}>输入解压密码</Typography>
                  <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>从图集中进入会自动填入密码</Typography>
                </CardContent>
                <CardContent style={{ paddingTop: 8 }}>
                  <TextField fullWidth autoComplete='off' label='解压密码' size='small' color='inherit' value={password} onChange={e => setPassword(e.target.value)} />
                </CardContent>
              </Card>

              <Card style={{ width: '100%', maxWidth: 420, minHeight: 160, aspectRatio: '2 / 1', flexShrink: 0 }}>
                <label style={{ width: '100%', height: '100%', display: 'block' }}>
                  <CardActionArea style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8 }} component='div'>
                    <input multiple style={{ display: 'none' }} onChange={onUpload} type='file'></input>
                    <UploadIcon style={{ width: 32, height: 32, opacity: 0.5 }} />
                    <Typography variant='body2' style={{ fontSize: 14, opacity: 0.5 }}>选择上一步保存的文件解压</Typography>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>上传ZIP文件</Typography>
                  </CardActionArea>
                </label>
              </Card>

              {
                downloadFiles.length === 0 ?
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', maxWidth: 420 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>如解压失败或闪退时请用其他软件解压</Typography>
                  </div>
                  : null
              }

              {
                downloadFiles.length > 0 ?
                  <Card style={{ width: '100%', maxWidth: 420, flexShrink: 0 }}>
                    <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant='body2' style={{ fontSize: 14 }}>解压文件</Typography>
                        <Button color='inherit' variant='text' onClick={onDownloadAll}>下载全部<FileDownloadIcon style={{ marginLeft: 4 }} /></Button>
                      </div>
                      <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>手机无法使用下载全部时请单个下载</Typography>
                    </CardContent>
                    <CardContent style={{ display: 'flex', flexDirection: 'column', paddingTop: 0 }}>
                      {
                        downloadFiles.map((i, index) => {
                          return <div key={index} id={index === downloadFiles.length - 1 ? 'downloadFilesLast' : undefined} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                            <Typography variant='body2' style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.name}</Typography>
                            <IconButton onClick={() => onDownload(i)}><DownloadIcon /></IconButton>
                          </div>
                        })
                      }
                    </CardContent>
                  </Card>
                  : null
              }
            </>
            : null
        }

        {
          step === 2 ?
            <div style={{ width: '100%', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ width: '100%', maxWidth: 240, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Radio checked={device === 0} onChange={(e) => onChangeDevice(0)} />
                  <Typography variant='body2' style={{ fontSize: 12 }}>IOS 苹果</Typography>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Radio checked={device === 1} onChange={(e) => onChangeDevice(1)} />
                  <Typography variant='body2' style={{ fontSize: 12 }}>Android 安卓</Typography>
                </div>
              </div>
              {
                device === 0 ?
                  <>
                    {
                      [DecodeIOS_1, DecodeIOS_2, DecodeIOS_3, DecodeIOS_4, DecodeIOS_5, DecodeIOS_6].map((i, index) => {
                        if (stepTip === index) return <Image
                          lazy
                          card
                          cardActionArea
                          key={index}
                          src={i}
                          mode='Image'
                          loadingSize={32}
                          styleImageVisible={{ width: '100%', maxWidth: 240 }}
                          styleImageInvisible={{ width: '100%', aspectRatio: '1 / 1' }}
                          onClick={() => contextApp.dialogsArrayAction.add('ImageView', { image: i })}
                        />
                      })
                    }
                    <Pagination sx={{ '& .MuiPagination-ul': { gap: '4px' }, '& .MuiPaginationItem-root': { margin: 0 } }} color='primary' boundaryCount={1} siblingCount={0} page={stepTip + 1} count={6} onChange={(v, page) => setStepTip(page - 1)}></Pagination>
                  </>
                  : null
              }
              {
                device === 1 ?
                  <>
                    {
                      [DecodeAndroid_1, DecodeAndroid_2, DecodeAndroid_3, DecodeAndroid_4, DecodeAndroid_5].map((i, index) => {
                        if (stepTip === index) return <Image
                          lazy
                          card
                          cardActionArea
                          key={index}
                          src={i}
                          mode='Image'
                          loadingSize={32}
                          styleImageVisible={{ width: '100%', maxWidth: 240 }}
                          styleImageInvisible={{ width: '100%', aspectRatio: '1 / 1' }}
                          onClick={() => contextApp.dialogsArrayAction.add('ImageView', { image: i })}
                        />
                      })
                    }
                    <Pagination sx={{ '& .MuiPagination-ul': { gap: '4px' }, '& .MuiPaginationItem-root': { margin: 0 } }} color='primary' boundaryCount={1} siblingCount={0} page={stepTip + 1} count={5} onChange={(v, page) => setStepTip(page - 1)}></Pagination>
                  </>
                  : null
              }
            </div>
            : null
        }

      </DialogContent>
      <DialogActions>
        <Button onClick={() => setStep(i => i - 1)} disabled={step === 0}>上一步</Button>
        <Button onClick={() => setStep(i => i + 1)} disabled={step === 2}>下一步</Button>
        <Button onClick={onContact}>联系客服</Button>
      </DialogActions>
    </Dialog >

  return Component
}

export default App