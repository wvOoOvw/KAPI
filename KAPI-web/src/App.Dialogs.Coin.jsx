import React from 'react'

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
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'

import { Context as ContextApp } from './App'

import { copy } from './utils.copy'

import ContactQQ_2 from '../static/image/ContactQQ_2.jpg'
import ContactWXMP_1 from '../static/image/ContactWXMP_1.jpg'

function CardGroupCash(props) {
  const name = props.name
  const cost = props.cost
  const coin = props.coin
  const gift = props.gift
  const description = props.description
  const onClick = props.onClick

  const Component =
    <Card>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Typography variant='body2' style={{ fontSize: 16 }}>{name}</Typography>
            <Typography variant='body2'>
              <span style={{ opacity: 0.5, marginRight: 4 }}>RMB ¥</span>
              <span>{cost}</span>
            </Typography>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='body2'>
              <span style={{ opacity: 0.5, fontSize: 12 }}>{description}</span>
            </Typography>
            <Typography variant='body2'>
              <span style={{ opacity: 0.5, fontSize: 12, marginRight: 4 }}>兑换硬币</span>
              <span>{coin + gift}</span>
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>

  return Component
}

function CardContactCash() {
  const contextApp = React.useContext(ContextApp)

  const onCopy = async (text) => {
    await copy(text)
      .then(() => {
        contextApp.messageArrayAction.add('已复制到剪贴板')
      })
      .catch(() => {
        contextApp.messageArrayAction.add('复制失败')
      })
  }

  const Component =
    <Card>
      <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Typography variant='body1' style={{ textAlign: 'center' }}>联系客服兑换</Typography>
        <Divider style={{ width: '100%' }} />
        <Typography variant='body2' style={{ textAlign: 'center' }}>将ID发给下方QQ客服（点击复制）</Typography>
        <Button variant='outlined' color='primary' size='small' style={{ fontSize: 12 }} onClick={() => onCopy(contextApp.user._id)}>ID {contextApp.user._id}</Button>
        <Divider style={{ width: '100%' }} />
        <img src={ContactQQ_2} style={{ width: '100%' }} />
        <img src={ContactWXMP_1} style={{ width: '100%' }} />
        <Divider style={{ width: '100%' }} />
        <Typography variant='body2' style={{ textAlign: 'center', fontSize: 12 }}>添加不上时，关注下方公众号，私信留下QQ号或微信号！</Typography>
      </CardContent>
    </Card>

  return Component
}

function App() {
  const contextApp = React.useContext(ContextApp)

  const group = [
    { type: 'Cash', cost: 6, coin: 60, gift: 0, name: '试用套餐', description: '尝尝咸淡～' },
    { type: 'Cash', cost: 30, coin: 300, gift: 60, name: '基础套餐', description: '赠送60硬币' },
    { type: 'Cash', cost: 60, coin: 600, gift: 150, name: '升级套餐', description: '赠送150硬币' },
    { type: 'Cash', cost: 128, coin: 1280, gift: 400, name: '高级套餐', description: '赠送400硬币' },
    { type: 'Cash', cost: 258, coin: 2580, gift: 1300, name: '高级套餐', description: '赠送1200硬币' },
  ]

  const method = [
    { type: 'Cash', name: '联系人工客服兑换' }
  ]

  const [step, setStep] = React.useState(0)

  const [selectedGroup, setSelectedGroup] = React.useState()
  const [selectedMethod, setSelectedMethod] = React.useState()

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('Coin')) {
      setStep(0)
      setSelectedGroup()
      setSelectedMethod()
    }
    if (contextApp.dialogsArrayAction.exist('Coin') && contextApp.user === undefined) {
      contextApp.dialogsArrayAction.remove('Coin').add('UserLogin')
      contextApp.messageArrayAction.add('请先登录')
    }
  }, [contextApp.dialogsArrayAction.exist('Coin'), contextApp.user])

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('Coin') && step && document.getElementById('step' + step)) {
      document.getElementById('step' + step).scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }
  }, [contextApp.dialogsArrayAction.exist('Coin'), step])

  const Component =
    <Dialog open={contextApp.dialogsArrayAction.exist('Coin')} onClose={() => contextApp.dialogsArrayAction.remove('Coin')} sx={{ '& .MuiDialog-paper': { width: 600, maxWidth: 'unset' } }}>
      <DialogTitle>
        <Typography color='primary' style={{ fontSize: 20 }}>获取硬币</Typography>
      </DialogTitle>
      <DialogContent style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Stepper alternativeLabel activeStep={step} style={{ overflow: 'auto', flexShrink: 0 }}>
          <Step style={{ minWidth: 80 }} id='step0'>
            <StepLabel style={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => step > 0 ? setStep(0) : undefined}>选择套餐</StepLabel>
          </Step>
          <Step style={{ minWidth: 80 }} id='step1'>
            <StepLabel style={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => step > 1 ? setStep(1) : undefined}>兑换方式</StepLabel>
          </Step>
          <Step style={{ minWidth: 80 }} id='step2'>
            <StepLabel style={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => step > 2 ? setStep(2) : undefined}>进行兑换</StepLabel>
          </Step>
        </Stepper>
        <div style={{ width: '100%', maxWidth: 320, margin: 'auto' }}>
          {
            step === 0 ?
              <>
                {
                  group.map((i, index) => {
                    if (i.type === 'Cash') return <CardGroupCash key={index} name={i.name} cost={i.cost} coin={i.coin} gift={i.gift} description={i.description} onClick={() => { setSelectedGroup(i); setStep(i => i + 1); }} />
                  })
                }
              </>
              : null
          }
          {
            step === 1 ?
              <>
                {
                  method.filter(i => i.type === selectedGroup.type).map((i, index) => {
                    if (i.type === 'Cash') return <CardGroupCash key={index} name={i.name} cost={selectedGroup.cost} coin={selectedGroup.coin} gift={selectedGroup.gift} description={selectedGroup.description} onClick={() => { setSelectedMethod(i); setStep(i => i + 1); }} />
                  })
                }
              </>
              : null
          }
          {
            step === 2 ?
              <>
                {
                  selectedMethod.type === 'Cash' ?
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <CardGroupCash name={selectedGroup.name} cost={selectedGroup.cost} coin={selectedGroup.coin} gift={selectedGroup.gift} description={selectedGroup.description} />
                      <CardContactCash />
                    </div>
                    : null
                }
              </>
              : null
          }
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => contextApp.dialogsArrayAction.remove('Coin')}>关闭</Button>
      </DialogActions>
    </Dialog >

  return Component
}

export default App