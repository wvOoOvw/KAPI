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
import CopyAllIcon from '@mui/icons-material/CopyAll'

import Image from './App.ComponentPure.Image'

import { Context as ContextApp } from './App'

import { copy } from './utils.copy'

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

  const onContact = () => {
    contextApp.dialogsArrayAction.remove('Application').add('Contact', { defaultTab: 1 })
  }

  const onDecode = () => {
    if (contextApp.dialogsArrayAction.props('DecodeGuide')?.compressMode === '7Z') {
      contextApp.messageArrayAction.add('当前图集类型不支持在线解压')
    }
    if (contextApp.dialogsArrayAction.props('DecodeGuide')?.compressMode === 'ZIP') {
      contextApp.dialogsArrayAction.remove('Application').add('Decode', { password: contextApp.dialogsArrayAction.props('DecodeGuide')?.compressPassword })
    }
  }

  const onCopy = async (text) => {
    await copy(text)
      .then(() => {
        contextApp.messageArrayAction.add('已复制到剪贴板')
      })
      .catch(() => {
        contextApp.messageArrayAction.add('复制失败')
      })
  }

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('DecodeGuide')) {
      setStep(0)
    }
  }, [contextApp.dialogsArrayAction.exist('DecodeGuide')])

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('DecodeGuide') && document.getElementById('step' + step)) {
      document.getElementById('step' + step).scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }
  }, [contextApp.dialogsArrayAction.exist('DecodeGuide'), step])

  const Component =
    <Dialog open={contextApp.dialogsArrayAction.exist('DecodeGuide')} onClose={() => contextApp.dialogsArrayAction.remove('DecodeGuide')} sx={{ '& .MuiDialog-paper': { width: 600, maxWidth: 'unset' } }}>
      <DialogTitle>
        <Typography color='primary' style={{ fontSize: 20 }}>解压教程</Typography>
      </DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 12 }}>

        <Stepper alternativeLabel activeStep={step} style={{ overflow: 'auto', flexShrink: 0, maxWidth: '100%', marginBottom: 12 }}>
          <Step style={{ minWidth: 100 }} id='step0'>
            <StepLabel style={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => setStep(0)}>网盘下载</StepLabel>
          </Step>
          <Step style={{ minWidth: 100 }} id='step1'>
            <StepLabel style={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => setStep(1)}>解压方式</StepLabel>
          </Step>
          <Step style={{ minWidth: 100 }} id='step2'>
            <StepLabel style={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => setStep(2)}>文件改名</StepLabel>
          </Step>
          <Step style={{ minWidth: 100 }} id='step3'>
            <StepLabel style={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => setStep(3)}>文件解压</StepLabel>
          </Step>
          <Step style={{ minWidth: 120 }} id='step4'>
            <StepLabel style={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => setStep(4)}>完整视频教程</StepLabel>
          </Step>
        </Stepper>

        {
          step === 0 ?
            <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 8, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <Typography variant='body2' style={{ fontSize: 12 }}>点击下方链接下载文件到本地设备</Typography>
              <Typography color='error' variant='body2' style={{ fontSize: 12 }}>注意: 不要在网盘中解压</Typography>
              <Typography color='error' variant='body2' style={{ fontSize: 12 }}>注意: 网盘内解压无法查看完整内容</Typography>
              <Card style={{ width: '100%', marginTop: 8 }}>
                <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
                  {
                    contextApp.dialogsArrayAction.props('DecodeGuide')?.downloadExternalLink ?
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>链接</Typography>
                          <CopyAllIcon style={{ width: 14, height: 14, cursor: 'pointer' }} onClick={() => onCopy(contextApp.dialogsArrayAction.props('DecodeGuide')?.downloadExternalLink)} />
                        </div>
                        <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => window.open(contextApp.dialogsArrayAction.props('DecodeGuide')?.downloadExternalLink)}>{contextApp.dialogsArrayAction.props('DecodeGuide')?.downloadExternalLink}</Button>
                      </div>
                      : null
                  }
                  {
                    contextApp.dialogsArrayAction.props('DecodeGuide')?.downloadExternalLinkPassword ?
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>提取码</Typography>
                          <CopyAllIcon style={{ width: 14, height: 14, cursor: 'pointer' }} onClick={() => onCopy(contextApp.dialogsArrayAction.props('DecodeGuide')?.downloadExternalLinkPassword)} />
                        </div>
                        <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => onCopy(contextApp.dialogsArrayAction.props('DecodeGuide')?.downloadExternalLinkPassword)}>{contextApp.dialogsArrayAction.props('DecodeGuide')?.downloadExternalLinkPassword}</Button>
                      </div>
                      : null
                  }
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>下载到本地设备教程视频（手机设备）</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => window.open('https://www.bilibili.com/video/BV19G4y157Ef')}>查看教程</Button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>下载到本地设备教程视频（电脑设备）</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => window.open('https://www.bilibili.com/video/BV1WD4y1V7yq')}>查看教程</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            : null
        }

        {
          step === 1 ?
            <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 8, display: 'flex', flexDirection: 'column', marginTop: 12, flexShrink: 0 }}>
              <Card>
                <CardActionArea onClick={onDecode}>
                  <CardContent>
                    <Typography variant='body2' style={{ fontSize: 14, marginBottom: 8 }}>在线解压</Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant='body2' style={{ fontSize: 12 }}>网站内解压，步骤简单</Typography>
                      <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>推荐</Typography>
                    </div>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card>
                <CardActionArea onClick={() => setStep(i => i + 1)}>
                  <CardContent>
                    <Typography variant='body2' style={{ fontSize: 14, marginBottom: 8 }}>本地解压</Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant='body2' style={{ fontSize: 12 }}>使用其他软件解压</Typography>
                      <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>查看下一步</Typography>
                    </div>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
            : null
        }

        {
          step === 2 ?
            <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 8, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              {
                contextApp.dialogsArrayAction.props('DecodeGuide')?.compressMode === '7Z' ?
                  <>
                    <Typography variant='body2' style={{ fontSize: 12 }}>改名上一步下载到本地的文件后缀为.7z</Typography>
                  </>
                  : null
              }
              {
                contextApp.dialogsArrayAction.props('DecodeGuide')?.compressMode === 'ZIP' ?
                  <>
                    <Typography variant='body2' style={{ fontSize: 12 }}>改名上一步下载到本地的文件后缀为.zip</Typography>
                  </>
                  : null
              }
              <Card style={{ width: '100%', marginTop: 8 }}>
                <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>修改文件后缀教程视频（苹果手机）</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => window.open('https://www.bilibili.com/video/BV1fT4y1X7E1')}>查看教程</Button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>修改文件子追教程视频（安卓手机）</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => window.open('https://www.bilibili.com/video/BV1Zu411d7U4')}>查看教程</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            : null
        }

        {
          step === 3 ?
            <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 8, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <Typography variant='body2' style={{ fontSize: 12 }}>使用解压软件解压上一步的文件</Typography>
              <Card style={{ width: '100%', marginTop: 8 }}>
                <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
                  {
                    contextApp.dialogsArrayAction.props('DecodeGuide')?.compressPassword ?
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>解压码</Typography>
                          <CopyAllIcon style={{ width: 14, height: 14, cursor: 'pointer' }} onClick={() => onCopy(contextApp.dialogsArrayAction.props('DecodeGuide')?.compressPassword)} />
                        </div>
                        <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => onCopy(contextApp.dialogsArrayAction.props('DecodeGuide')?.compressPassword)}>{contextApp.dialogsArrayAction.props('DecodeGuide')?.compressPassword}</Button>
                      </div>
                      : null
                  }
                </CardContent>
              </Card>
              <Card style={{ width: '100%' }}>
                <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
                  <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>Windows电脑解压教程</Typography>
                </CardContent>
                <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16, paddingTop: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>解压软件</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => window.open('https://www.7-zip.org/download.html')}>查看下载</Button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>教程视频</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => window.open('https://www.bilibili.com/video/BV1xZ4y1v7pU')}>查看教程</Button>
                  </div>
                </CardContent>
              </Card>
              <Card style={{ width: '100%' }}>
                <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
                  <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>Mac电脑解压教程</Typography>
                </CardContent>
                <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16, paddingTop: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>解压软件</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => window.open('https://theunarchiver.com')}>查看下载</Button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>教程视频</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => window.open('https://www.bilibili.com/video/BV1ga411B7wr')}>查看教程</Button>
                  </div>
                </CardContent>
              </Card>
              <Card style={{ width: '100%' }}>
                <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
                  <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>安卓手机解压教程</Typography>
                </CardContent>
                <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16, paddingTop: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>解压软件</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => { contextApp.messageArrayAction.add('请前往应用商店下载') }}>zarchiver pro</Button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>教程视频</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => window.open('https://www.bilibili.com/video/BV15Z4218785')}>查看教程</Button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>解压软件（备用）</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => { contextApp.messageArrayAction.add('请前往应用商店下载') }}>解压专家</Button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>教程视频</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => window.open('https://www.bilibili.com/video/BV17ZUHYWE6T')}>查看教程</Button>
                  </div>
                </CardContent>
              </Card>
              <Card style={{ width: '100%' }}>
                <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
                  <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>苹果手机解压教程</Typography>
                </CardContent>
                <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16, paddingTop: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>解压软件</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => { contextApp.messageArrayAction.add('请前往应用商店下载') }}>ES文件浏览器</Button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>教程视频</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => window.open('https://www.bilibili.com/video/BV1rW4y1j7fM')}>查看教程</Button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>解压软件（备用）</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => { contextApp.messageArrayAction.add('请前往应用商店下载') }}>解压专家</Button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>教程视频</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => window.open('https://www.bilibili.com/video/BV17ZUHYWE6T')}>查看教程</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            : null
        }

        {
          step === 4 ?
            <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 8, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <Typography variant='body2' style={{ fontSize: 12 }}>当前视频仅供参考，如果手机型号或者软件版本有问题，请按照前几步的具体操作步骤进行</Typography>
              <Card style={{ width: '100%', marginTop: 8 }}>
                <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>教程视频（苹果电脑）</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => window.open('https://www.zhihu.com/zvideo/1903796228069781820')}>查看教程</Button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>教程视频（安卓手机）</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => window.open('https://www.zhihu.com/zvideo/1903831227087198103')}>查看教程</Button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>教程视频（苹果手机）</Typography>
                    <Button color='inherit' variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => window.open('https://www.zhihu.com/zvideo/1903831622584897897')}>查看教程</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            : null
        }

      </DialogContent>
      <DialogActions>
        <Button onClick={() => setStep(i => i - 1)} disabled={step === 0}>上一步</Button>
        <Button onClick={() => setStep(i => i + 1)} disabled={step === 4}>下一步</Button>
        <Button onClick={onContact}>联系客服</Button>
      </DialogActions>
    </Dialog >

  return Component
}

export default App