import React from 'react'
import * as ReactRouterDom from "react-router-dom"
import * as ReactActivation from "react-activation"

import Button from '@mui/material/Button'

import FlightLandIcon from '@mui/icons-material/FlightLand'
import CallIcon from '@mui/icons-material/Call'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'

import { useResize } from './App.ComponentHookPure.Resize'

import { Context as ContextApp } from './App'

import Landing from '../static/image/Landing.webp'

const inWechat = window.navigator.userAgent.toLowerCase().includes('micromessenger') || window.navigator.userAgent.toLowerCase().includes('qq')

function App() {
  const navigate = ReactRouterDom.useNavigate()

  const contextApp = React.useContext(ContextApp)

  const { size } = useResize()

  const blockHeight = React.useMemo(() => {
    if (size !== undefined) {
      var height = size.width / 4
      if (height > 300) height = 300
      if (height < 220) height = 220
      return height
    }

    return 0
  }, [size])

  const onAlbum = () => {
    if (inWechat) {
      contextApp.messageArrayAction.add('请使用夸克浏览器或者谷歌浏览器')
      return
    }
    navigate(`/album`)
  }

  const onCartoon = () => {
    if (inWechat) {
      contextApp.messageArrayAction.add('请使用夸克浏览器或者谷歌浏览器')
      return
    }
    navigate(`/cartoon`)
  }

  const onUser = () => {
    if (inWechat) {
      contextApp.messageArrayAction.add('请使用夸克浏览器或者谷歌浏览器')
      return
    }
    navigate('/user')
  }

  const onLogin = () => {
    if (inWechat) {
      contextApp.messageArrayAction.add('请使用夸克浏览器或者谷歌浏览器')
      return
    }
    contextApp.dialogsArrayAction.add('UserLogin')
  }

  const onCoin = () => {
    if (inWechat) {
      contextApp.messageArrayAction.add('请使用夸克浏览器或者谷歌浏览器')
      return
    }
    contextApp.dialogsArrayAction.add('Coin')
  }

  const onContact = () => {
    if (inWechat) {
      contextApp.messageArrayAction.add('请使用夸克浏览器或者谷歌浏览器')
      return
    }
    contextApp.dialogsArrayAction.add('Contact')
  }

  const Component =
    <>
      {
        size ?
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div style={{ width: '100%', maxWidth: 880, height: 'fit-content', backgroundImage: `url(${Landing})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div style={{ mixBlendMode: 'screen', background: 'white', display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ background: 'black', mixBlendMode: 'normal', borderRadius: 32, width: '100%', height: blockHeight, flexGrow: 1 }}></div>
                  <div style={{ background: 'black', mixBlendMode: 'normal', borderRadius: 32, width: '100%', height: blockHeight, flexGrow: 1 }}></div>
                  <div style={{ background: 'black', mixBlendMode: 'normal', borderRadius: 32, width: '100%', height: blockHeight, flexGrow: 1 }}></div>
                  <div style={{ background: 'black', mixBlendMode: 'normal', borderRadius: 32, width: '100%', height: blockHeight, flexGrow: 1 }}></div>
                  <div style={{ background: 'black', mixBlendMode: 'normal', borderRadius: 32, width: '100%', height: blockHeight, flexGrow: 1 }}></div>
                </div>
              </div>
              <div style={{ width: '100%', maxWidth: 880, height: 'fit-content', position: 'absolute' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ borderRadius: 32, width: '100%', height: blockHeight, flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 24 }}>
                    <div style={{ fontSize: 48, color: 'white', fontWeight: 'bold', letterSpacing: '2px' }}>KAPIKAPI</div>
                    <div style={{ fontSize: 16, color: 'white', letterSpacing: '4px' }}>从下方入口进入到不同的内容</div>
                  </div>
                  <div style={{ borderRadius: 32, width: '100%', height: blockHeight, flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 24 }}>
                    <div style={{ fontSize: 24, color: 'white', letterSpacing: '4px' }}>寻找你想看的图集</div>
                    <div style={{ fontSize: 14, color: 'white', letterSpacing: '4px' }}>点击下方按钮进入</div>
                    <Button style={{ borderRadius: '50%', padding: 8, minWidth: 'unset', minHeight: 'unset', borderColor: 'white', backdropFilter: 'blur(4px)' }} variant='outlined' onClick={onAlbum}><FlightLandIcon style={{ width: 24, height: 24, color: 'white' }} /></Button>
                  </div>
                  <div style={{ borderRadius: 32, width: '100%', height: blockHeight, flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 24 }}>
                    <div style={{ fontSize: 24, color: 'white', letterSpacing: '4px' }}>寻找你想看的漫画</div>
                    <div style={{ fontSize: 14, color: 'white', letterSpacing: '4px' }}>点击下方按钮进入</div>
                    <Button style={{ borderRadius: '50%', padding: 8, minWidth: 'unset', minHeight: 'unset', borderColor: 'white', backdropFilter: 'blur(4px)' }} variant='outlined' onClick={onCartoon}><FlightLandIcon style={{ width: 24, height: 24, color: 'white' }} /></Button>
                  </div>
                  <div style={{ borderRadius: 32, width: '100%', height: blockHeight, flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 24 }}>
                    {
                      contextApp.user !== undefined ?
                        <>
                          <div style={{ fontSize: 24, color: 'white', letterSpacing: '4px' }}>查看我的账号</div>
                          <div style={{ fontSize: 14, color: 'white', letterSpacing: '4px' }}>点击下方按钮进入</div>
                          <Button style={{ borderRadius: '50%', padding: 8, minWidth: 'unset', minHeight: 'unset', borderColor: 'white', backdropFilter: 'blur(4px)' }} variant='outlined' onClick={onUser}><FlightLandIcon style={{ width: 24, height: 24, color: 'white' }} /></Button>
                        </>
                        : null
                    }
                    {
                      contextApp.user === undefined ?
                        <>
                          <div style={{ fontSize: 24, color: 'white', letterSpacing: '4px' }}>登录/注册</div>
                          <div style={{ fontSize: 14, color: 'white', letterSpacing: '4px' }}>点击下方按钮进入</div>
                          <Button style={{ borderRadius: '50%', padding: 8, minWidth: 'unset', minHeight: 'unset', borderColor: 'white', backdropFilter: 'blur(4px)' }} variant='outlined' onClick={onLogin}><FlightLandIcon style={{ width: 24, height: 24, color: 'white' }} /></Button>
                        </>
                        : null
                    }
                  </div>
                  <div style={{ mixBlendMode: 'normal', borderRadius: 32, width: '100%', height: blockHeight, flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 24 }}>
                      <div style={{ fontSize: 24, color: 'white', letterSpacing: '4px' }}>联系客服</div>
                      <Button style={{ borderRadius: '50%', padding: 8, minWidth: 'unset', minHeight: 'unset', borderColor: 'white', backdropFilter: 'blur(4px)' }} variant='outlined' onClick={onContact}><CallIcon style={{ width: 24, height: 24, color: 'white' }} /></Button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 24 }}>
                      <div style={{ fontSize: 24, color: 'white', letterSpacing: '4px' }}>获取硬币</div>
                      <Button style={{ borderRadius: '50%', padding: 8, minWidth: 'unset', minHeight: 'unset', borderColor: 'white', backdropFilter: 'blur(4px)' }} variant='outlined' onClick={onCoin}><LocalAtmIcon style={{ width: 24, height: 24, color: 'white' }} /></Button>
                    </div>
                  </div>
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