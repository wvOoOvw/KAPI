import React from 'react'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { Context as ContextApp } from './App'

import ChatBackground from '../static/image/ChatBackground.jpg'

function App() {
  const contextApp = React.useContext(ContextApp)

  const [hover, setHover] = React.useState(false)

  const onContactChat = (category) => {
    contextApp.dialogsArrayAction.add('ContactChat', category ? { category } : undefined)
  }

  const Component = (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onContactChat()}
      style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', width: '100%', cursor: 'pointer', background: `url(${ChatBackground}) center/cover no-repeat`, boxShadow: '0 20px 48px rgba(0, 0, 0, 0.22)', transform: hover ? 'translateY(-2px)' : 'translateY(0)', transition: 'transform 0.5s' }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(20, 12, 30, 0.55) 0%, rgba(20, 12, 30, 0.25) 45%, rgba(218, 122, 133, 0.35) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 85% 20%, rgba(255, 180, 200, 0.25), transparent 55%)' }} />
      <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: 'fit-content', padding: '4px 10px', borderRadius: 999, background: 'rgba(255, 255, 255, 0.16)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.25)', color: '#fff', fontSize: 12, letterSpacing: 1, whiteSpace: 'nowrap' }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: contextApp.theme.palette.primary.main }} />
              专业陪聊 · 24h 在线
            </div>
            <Typography style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: 2, textShadow: '0 4px 24px rgba(0,0,0,0.4)', lineHeight: 1.2 }}>
              找个人，好好聊聊
            </Typography>
            <Typography style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.9)', letterSpacing: 1, textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
              温柔倾诉 · 专业陪伴 · 倾听你的每一个瞬间
            </Typography>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, color: '#fff', textAlign: 'right' }}>
            <Typography style={{ fontSize: 12, whiteSpace: 'nowrap' }}>点击海报开启</Typography>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 16, background: 'rgba(255, 255, 255, 0.14)', border: '1px solid rgba(255, 255, 255, 0.22)', backdropFilter: 'blur(10px)', cursor: 'pointer', transition: 'transform .25s, background .25s, border-color .25s' }}>
              <span style={{ position: 'absolute', top: -8, right: 12, padding: '2px 8px', fontSize: 10, color: '#fff', borderRadius: 999, background: contextApp.theme.palette.primary.main }}>热门</span>
              <div style={{ fontSize: 18 }}>🎙️</div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Typography style={{ fontSize: 12, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>语音陪聊</Typography>
                <Typography style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>暖心声音 · 情感陪伴</Typography>
              </div>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 16, background: 'rgba(255, 255, 255, 0.14)', border: '1px solid rgba(255, 255, 255, 0.22)', backdropFilter: 'blur(10px)', cursor: 'pointer', transition: 'transform .25s, background .25s, border-color .25s' }}>
              <span style={{ position: 'absolute', top: -8, right: 12, padding: '2px 8px', fontSize: 10, color: '#fff', borderRadius: 999, background: contextApp.theme.palette.primary.main }}>推荐</span>
              <div style={{ fontSize: 18 }}>🎮</div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Typography style={{ fontSize: 12, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>游戏陪玩</Typography>
                <Typography style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>上分开黑 · 欢乐互动</Typography>
              </div>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 16, background: 'rgba(255, 255, 255, 0.14)', border: '1px solid rgba(255, 255, 255, 0.22)', backdropFilter: 'blur(10px)', cursor: 'pointer', transition: 'transform .25s, background .25s, border-color .25s' }}>
              <div style={{ fontSize: 18 }}>💬</div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Typography style={{ fontSize: 12, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>文字陪聊</Typography>
                <Typography style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>心灵树洞 · 倾诉心事</Typography>
              </div>
            </div>
          </div>
          <Button onClick={(e) => { onContactChat() }} color="primary" variant="contained" style={{ fontSize: 12, fontWeight: 700, padding: '10px 20px', borderRadius: 14, letterSpacing: 2, boxShadow: '0 10px 24px rgba(218, 122, 133, 0.45)', whiteSpace: 'nowrap' }}>立即咨询</Button>
        </div>
      </div>
    </div>
  )

  return Component
}

export default App
