import React from 'react'
import * as ReactRouterDom from "react-router-dom"

import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'

import HomeIcon from '@mui/icons-material/Home'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ImageIcon from '@mui/icons-material/Image'
import BookIcon from '@mui/icons-material/Book'

import { useScroll } from './App.ComponentHookPure.Scroll'

function App() {
  const pathname = ReactRouterDom.useLocation().pathname
  const navigate = ReactRouterDom.useNavigate()

  const [open, setOpen] = React.useState(false)

  const { scrollIng } = useScroll({ time: 500 })

  const onLink = (link) => {
    if (link !== pathname) navigate(link)
  }

  React.useEffect(() => {
    if (scrollIng === true || pathname === '/') setOpen(false)
    if (scrollIng !== true && pathname !== '/') setOpen(true)
  }, [pathname, scrollIng])

  const Component =
    <Paper style={{ position: 'fixed', zIndex: 100, left: 0, right: 0, bottom: open ? 24 : 12, width: 'fit-content', display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', padding: '4px 12px', margin: 'auto', borderRadius: 120, background: 'white', opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none', transition: '0.5s all' }}>
      <IconButton onClick={() => onLink('/')}>
        <HomeIcon color='primary' />
      </IconButton>
      <IconButton onClick={() => onLink('/album')}>
        <ImageIcon color='primary' />
      </IconButton>
      <IconButton onClick={() => onLink('/cartoon')}>
        <BookIcon color='primary' />
      </IconButton>
      <IconButton onClick={() => onLink(-1)}>
        <ArrowBackIcon color='primary' />
      </IconButton>
    </Paper>

  return Component
}

export default App