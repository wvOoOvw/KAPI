import React from 'react'

import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'

import { Context as ContextApp } from './App'

import favicon from '../static/image/favicon.png'

function App() {
    const contextApp = React.useContext(ContextApp)

    const onContact = () => {
        contextApp.dialogsArrayAction.add('Contact', { defaultTab: 1 })
    }

    const Component =
        <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
            <Avatar src={favicon} style={{ width: 48, height: 48 }} />
            <Button onClick={onContact}>网站维护中 开放时间关注客服消息</Button>
        </div>

    return Component
}

export default App