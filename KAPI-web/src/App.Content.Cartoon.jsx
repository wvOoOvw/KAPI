import React from 'react'
import ReactDOM from 'react-dom'
import * as ReactRouterDom from "react-router-dom"

import Masonry from 'react-masonry-css'

import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Fab from '@mui/material/Fab'
import Chip from '@mui/material/Chip'

import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import RefreshIcon from '@mui/icons-material/Refresh'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

import { Image } from './App.ComponentPure.Image'
import { Resize } from './App.ComponentHookPure.Resize'
import { useScroll } from './App.ComponentHookPure.Scroll'
import { useActivation } from './App.ComponentHookPure.Activation'

import { Context as ContextApp } from './App'

import { Fetch } from './utils.fetch'

import PosterEmpty from '../static/image/PosterEmpty.jpg'

function Cartoon(props) {
  const cartoon = props.cartoon

  const navigate = ReactRouterDom.useNavigate()

  const contextApp = React.useContext(ContextApp)

  const onView = () => {
    navigate(`/cartoon/${cartoon._id}`)
  }

  const Component =
    <Card style={{ borderRadius: 16 }}>
      <CardActionArea style={{ position: 'relative' }} onClick={onView}>
        <div style={{ position: 'relative' }}>
          {
            cartoon.poster[0] !== undefined ?
              <Image
                lazy
                src={cartoon.poster[0].posterFileLink}
                mode='Image'
                loadingSize={32}
                styleImageVisible={{ width: '100%' }}
                styleImageInvisible={{ width: '100%', aspectRatio: '1 / 1' }}
              />
              : null
          }
          {
            cartoon.poster[0] === undefined ? <img src={PosterEmpty} style={{ display: 'block', width: '100%' }} /> : null
          }
          {
            cartoon.poster[0] === undefined ? <Button variant='contained' component='div' color='inherit' style={{ minWidth: 'unset', padding: '4px 12px', fontSize: 10, opacity: 0.5, position: 'absolute', top: 8, right: 8 }}>暂无预览图</Button> : null
          }
        </div>
        <CardContent style={{ padding: '8px 16px', position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0, 0, 0, 0.25)' }}>
          <Typography variant='body2' style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', display: '-webkit-box', color: 'white' }}>{cartoon.name}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>

  return Component
}

function CartoonMasonry(props) {
  const cartoon = props.cartoon

  const Component =
    <Resize>
      {
        ({ size }) => {
          var breakpointCols = 0

          if (size && size.width > 0) breakpointCols = 2
          if (size && size.width > 720) breakpointCols = 3
          if (size && size.width > 1080) breakpointCols = 4

          return <div>
            {
              breakpointCols ?
                <Masonry
                  breakpointCols={breakpointCols}
                  className="masonry-grid"
                  columnClassName="masonry-grid_column"
                  style={{ width: '100%', margin: 0 }}
                >
                  {
                    cartoon.map((i) => <Cartoon key={i._id} cartoon={i} />)
                  }
                </Masonry>
                : null
            }
          </div>
        }
      }
    </Resize>

  return Component
}

function App() {
  const navigate = ReactRouterDom.useNavigate()

  const contextApp = React.useContext(ContextApp)

  const [cartoonSeed, setCartoonSeed] = React.useState(1)
  const [cartoon, setCartoon] = React.useState([])
  const [cartoonLoadEnable, setCartoonLoadEnable] = React.useState()
  const [cartoonLoading, setCartoonLoading] = React.useState()
  const [cartoonFilter, setCartoonFilter] = React.useState({ name: new URLSearchParams(new URL(window.location.href).search).get('search') || '', latest: false })

  const scrollElementRef = React.useRef()

  const { scrollTop } = useScroll({ time: 1000 })
  const { active } = useActivation()

  const onFetchCartoon = async () => {
    const seed = cartoonFilter.latest ? 10000000000000 : Math.round(Math.random() * 10000 + 1)

    setCartoonSeed(seed)

    setCartoon([])
    setCartoonLoading(true)

    await Fetch.json('/api/app/cartoon/find/list', { filter: { ...cartoonFilter, status: 1, latest: undefined }, seed: seed, skip: 0, limit: 10 })
      .then(res => {
        setCartoon(res.data)
        if (res.data.length !== 0) setCartoonLoadEnable(true)
        if (res.data.length === 0) setCartoonLoadEnable(false)
      })
      .catch(res => {
        setCartoonLoadEnable(false)
        if (contextApp.tabPage === 0) contextApp.messageArrayAction.add('检索内容失败')
      })

    setCartoonLoading(false)
  }

  const onFetchCartoonScroll = async () => {
    setCartoonLoading(true)

    await Fetch.json('/api/app/cartoon/find/list', { filter: { ...cartoonFilter, status: 1, latest: undefined }, seed: cartoonSeed, skip: cartoon.length, limit: 10 })
      .then(res => {
        setCartoon(i => [...i, ...res.data])
        if (res.data.length === 0) setCartoonLoadEnable(false)
        if (res.data.length === 0) contextApp.messageArrayAction.add('没有更多内容')
      })
      .catch(res => {
        if (contextApp.tabPage === 0) contextApp.messageArrayAction.add('检索内容失败')
      })

    setCartoonLoading(false)
  }

  const onClose = () => {
    navigate('/')
  }

  const onScrollTop = () => {
    document.documentElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  const initCartoon = async () => {
    await onFetchCartoon()
  }

  React.useEffect(() => {
    if (cartoon.length >= 10 && cartoonLoadEnable === true && cartoonLoading === false && scrollElementRef.current) {
      const observer = new IntersectionObserver(en => {
        if (en[0].intersectionRatio > 0) onFetchCartoonScroll()
      })

      observer.observe(scrollElementRef.current)

      return () => observer.disconnect()
    }
  }, [cartoon, cartoonLoadEnable, cartoonLoading])

  React.useEffect(() => { initCartoon() }, [cartoonFilter, contextApp.user])

  const Component =
    <>

      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', padding: 24, paddingBottom: 96 }}>
        <div style={{ width: '100%', maxWidth: 1200, height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <Typography color='primary' style={{ fontSize: 28 }}>漫画</Typography>
            <CloseIcon color='primary' style={{ width: 32, height: 32, cursor: 'pointer' }} onClick={onClose} />
          </div>

          <div style={{ display: 'flex', gap: 4, width: '100%', marginBottom: 16 }}>
            <div style={{ flexGrow: 1, flexShrink: 1, display: 'flex', alignItems: 'center', gap: 4, overflowY: 'auto' }}>
              <Button style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 14, lineHeight: '24px' }} onClick={() => setCartoonFilter({ ...cartoonFilter, latest: false })}>推荐</Button>
              <Button style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 14, lineHeight: '24px' }} variant={cartoonFilter.latest ? 'contained' : 'text'} onClick={() => setCartoonFilter({ ...cartoonFilter, latest: !cartoonFilter.latest })}>最新发布</Button>
            </div>
            <div style={{ width: 'fit-content', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Button style={{ minWidth: 'unset', padding: '4px 8px' }} onClick={onFetchCartoon}><RefreshIcon style={{ width: 24, height: 24 }} /></Button>
              {
                cartoonFilter.name === '' ?
                  <Button style={{ minWidth: 'unset', padding: '4px 8px' }} onClick={() => contextApp.dialogsArrayAction.add('CartoonFilter', { text: cartoonFilter.name, onConfirm: (text) => setCartoonFilter({ ...cartoonFilter, name: text }) })}>
                    <SearchIcon style={{ width: 24, height: 24 }} />
                  </Button>
                  : null
              }
              {
                cartoonFilter.name !== '' ?
                  <Button style={{ minWidth: 'unset', padding: '4px 8px' }} onClick={() => setCartoonFilter({ ...cartoonFilter, name: '' })}>
                    <SearchIcon style={{ width: 24, height: 24 }} />
                    <div style={{ maxWidth: 80, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cartoonFilter.name}</div>
                  </Button>
                  : null
              }
            </div>
          </div>

          {
            cartoon.length !== 0 ? <CartoonMasonry cartoon={cartoon} /> : null
          }

          {
            cartoonLoading === false && cartoonLoadEnable === false && cartoon.length === 0 ?
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12, padding: 12, height: cartoon.length === 0 ? 200 : 'fit-content' }}>
                <Typography color='primary' variant='body2' style={{ textAlign: 'center', fontSize: 12 }}>没有检索出内容</Typography>
                <Typography color='primary' variant='body2' style={{ textAlign: 'center', fontSize: 12, opacity: 0.5 }}>切换筛选条件后再试试</Typography>
              </div>
              : null
          }

          {
            cartoonLoading === true ?
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 12, height: cartoon.length === 0 ? 200 : 'fit-content' }}>
                <CircularProgress color='primary' size={32} />
              </div>
              : null
          }

          {
            cartoonLoadEnable === true ? <div ref={el => scrollElementRef.current = el} /> : null
          }
        </div>
      </div>

      {
        active === true ?
          ReactDOM.createPortal(
            <>
              <Fab disabled={scrollTop === 0} color='primary' style={{ position: 'fixed', bottom: 24, right: 24, opacity: scrollTop > 0 ? 1 : 0, transition: '0.5s all' }} onClick={onScrollTop}><ArrowUpwardIcon /></Fab>
            </>
            , document.body)
          : null
      }

    </>

  return Component
}

export default App