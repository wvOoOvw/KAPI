import React from 'react'
import ReactDOM from 'react-dom'
import * as ReactRouterDom from "react-router-dom"
import * as ReactActivation from "react-activation"

import Masonry from 'react-masonry-css'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Fab from '@mui/material/Fab'

import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

import { Image } from './App.ComponentPure.Image'
import { Resize } from './App.ComponentHookPure.Resize'
import { useScroll } from './App.ComponentHookPure.Scroll'
import { useActivation } from './App.ComponentHookPure.Activation'

import { Context as ContextApp } from './App'

import { Fetch } from './utils.fetch'
import { copy } from './utils.copy'

import PosterEmpty from '../static/image/PosterEmpty.jpg'
import AvatarEmpty from '../static/image/AvatarEmpty.jpg'

function AlbumMasonryItem(props) {
  const album = props.album

  const navigate = ReactRouterDom.useNavigate()

  const contextApp = React.useContext(ContextApp)

  const Component =
    <Card style={{ borderRadius: 16 }}>
      <CardActionArea style={{ position: 'relative' }} onClick={() => navigate(`/album/${album._id}`)}>
        <div style={{ position: 'relative' }}>
          {
            album.poster[0] !== undefined ?
              <Image
                lazy
                src={album.poster[0].posterFileLink}
                mode='Image'
                loadingSize={32}
                styleImageVisible={{ width: '100%' }}
                styleImageInvisible={{ width: '100%', aspectRatio: '1 / 1' }}
              />
              : null
          }
          {
            album.poster[0] === undefined ? <img src={PosterEmpty} style={{ display: 'block', width: '100%' }} /> : null
          }
          {
            album.poster[0] === undefined ? <Button variant='contained' component='div' color='inherit' style={{ minWidth: 'unset', padding: '4px 12px', fontSize: 10, opacity: 0.5, position: 'absolute', top: 8, right: 8 }}>暂无预览图</Button> : null
          }
        </div>
        <CardContent style={{ padding: '8px 16px', position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0, 0, 0, 0.25)' }}>
          <Typography variant='body2' style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', display: '-webkit-box', color: 'white' }}>{album.name}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>

  return Component
}

function AlbumMasonry(props) {
  const album = props.album

  const Component =
    <Resize>
      {
        ({ size }) => {
          var breakpointCols = 0

          if (size && size.width > 0) breakpointCols = 2
          if (size && size.width > 720) breakpointCols = 3

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
                    album.map((i) => <AlbumMasonryItem key={i._id} album={i} />)
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

function CartoonMasonryItem(props) {
  const cartoon = props.cartoon

  const navigate = ReactRouterDom.useNavigate()

  const contextApp = React.useContext(ContextApp)

  const Component =
    <Card style={{ borderRadius: 16 }}>
      <CardActionArea style={{ position: 'relative' }} onClick={() => navigate(`/cartoon/${cartoon._id}`)}>
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
                    cartoon.map((i) => <CartoonMasonryItem key={i._id} cartoon={i} />)
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

function TabAlbum(props) {
  const mode = props.mode
  const ComponentType= props.ComponentType

  const contextApp = React.useContext(ContextApp)

  const [album, setAlbum] = React.useState([])
  const [albumLoadEnable, setAlbumLoadEnable] = React.useState(true)
  const [albumLoading, setAlbumLoading] = React.useState(false)
  const [albumFilter, setAlbumFilter] = React.useState({ name: '' })

  const scrollElementRef = React.useRef()

  const onFetchAlbum = async () => {
    setAlbum([])
    setAlbumLoadEnable(true)
    setAlbumLoading(true)

    await Fetch.json('/api/app/album/find/list', { filter: { favorited: mode === 1 ? true : undefined, paid: mode === 2 ? true : undefined, user_id: mode === 0 ? contextApp.user && contextApp.user._id : undefined, ...albumFilter }, seed: 10000000000000, skip: 0, limit: 10 })
      .then(res => {
        setAlbum(res.data)
        if (res.data.length !== 0) setAlbumLoadEnable(true)
        if (res.data.length === 0) setAlbumLoadEnable(false)
      })
      .catch(res => {
        if (contextApp.tabPage === 0) contextApp.messageArrayAction.add('检索内容失败')
      })

    setAlbumLoading(false)
  }

  const onFetchAlbumScroll = async () => {
    setAlbumLoading(true)

    await Fetch.json('/api/app/album/find/list', { filter: { favorited: mode === 1 ? true : undefined, paid: mode === 2 ? true : undefined, user_id: mode === 0 ? contextApp.user && contextApp.user._id : undefined, ...albumFilter }, seed: 10000000000000, skip: album.length, limit: 10 })
      .then(res => {
        setAlbum(i => [...i, ...res.data])
        if (res.data.length === 0) setAlbumLoadEnable(false)
        if (res.data.length === 0) contextApp.messageArrayAction.add('没有更多内容')
      })
      .catch(res => {
        if (contextApp.tabPage === 0) contextApp.messageArrayAction.add('检索内容失败')
      })

    setAlbumLoading(false)
  }

  const initAlbum = async () => {
    await onFetchAlbum()
  }

  React.useEffect(() => {
    if (album.length >= 10 && albumLoadEnable === true && albumLoading !== true && scrollElementRef.current) {
      const observer = new IntersectionObserver(en => {
        if (en[0].intersectionRatio > 0) onFetchAlbumScroll()
      })
      observer.observe(scrollElementRef.current)
      return () => observer.disconnect()
    }
  }, [album, albumLoadEnable, albumLoading])

  React.useEffect(() => { initAlbum() }, [mode, albumFilter])

  const Component =
    <div>
      <div style={{ display: 'flex', gap: 4, width: '100%', marginBottom: 24 }}>
        <div style={{ flexGrow: 1, flexShrink: 1, display: 'flex', alignItems: 'center', gap: 4, overflowY: 'auto' }}>
          {
            ComponentType
          }
        </div>
        <div style={{ width: 'fit-content', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Button style={{ minWidth: 'unset', padding: '4px 8px' }} onClick={onFetchAlbum}><RefreshIcon style={{ width: 24, height: 24 }} /></Button>
          {
            albumFilter.name === '' ?
              <Button style={{ minWidth: 'unset', padding: '4px 8px' }} onClick={() => contextApp.dialogsArrayAction.add('AlbumFilter', { text: albumFilter.name, onConfirm: (text) => setAlbumFilter({ ...albumFilter, name: text }) })}>
                <SearchIcon style={{ width: 24, height: 24 }} />
              </Button>
              : null
          }
          {
            albumFilter.name !== '' ?
              <Button style={{ minWidth: 'unset', padding: '4px 8px' }} onClick={() => setAlbumFilter({ ...albumFilter, name: '' })}>
                <SearchIcon style={{ width: 24, height: 24 }} />
                <div style={{ maxWidth: 80, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{albumFilter.name}</div>
              </Button>
              : null
          }
        </div>
      </div>
      {
        album.length !== 0 ? <AlbumMasonry album={album} /> : null
      }
      {
        albumLoadEnable === false && album.length === 0 ?
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12, padding: 12, height: album.length === 0 ? 200 : 'fit-content' }}>
            <Typography color='primary' variant='body2' style={{ textAlign: 'center', fontSize: 12 }}>没有检索出内容</Typography>
            <Typography color='primary' variant='body2' style={{ textAlign: 'center', fontSize: 12, opacity: 0.5 }}>切换筛选条件后再试试</Typography>
          </div>
          : null
      }
      {
        albumLoading === true ?
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 12, height: album.length === 0 ? 200 : 'fit-content' }}>
            <CircularProgress color='primary' size={32} />
          </div>
          : null
      }
      {
        albumLoadEnable === true ? <div ref={el => scrollElementRef.current = el} /> : null
      }
    </div >

  return Component
}

function TabCartoon(props) {
  const mode = props.mode
  const ComponentType= props.ComponentType

  const contextApp = React.useContext(ContextApp)

  const [cartoon, setCartoon] = React.useState([])
  const [cartoonLoadEnable, setCartoonLoadEnable] = React.useState(true)
  const [cartoonLoading, setCartoonLoading] = React.useState(false)
  const [cartoonFilter, setCartoonFilter] = React.useState({ name: '' })

  const scrollElementRef = React.useRef()

  const onFetchCartoon = async () => {
    setCartoon([])
    setCartoonLoadEnable(true)
    setCartoonLoading(true)

    await Fetch.json('/api/app/cartoon/find/list', { filter: { favorited: mode === 1 ? true : undefined, paid: mode === 2 ? true : undefined, user_id: mode === 0 ? contextApp.user && contextApp.user._id : undefined, ...cartoonFilter }, seed: 10000000000000, skip: 0, limit: 10 })
      .then(res => {
        setCartoon(res.data)
        if (res.data.length !== 0) setCartoonLoadEnable(true)
        if (res.data.length === 0) setCartoonLoadEnable(false)
      })
      .catch(res => {
        if (contextApp.tabPage === 0) contextApp.messageArrayAction.add('检索内容失败')
      })

    setCartoonLoading(false)
  }

  const onFetchCartoonScroll = async () => {
    setCartoonLoading(true)

    await Fetch.json('/api/app/cartoon/find/list', { filter: { favorited: mode === 1 ? true : undefined, paid: mode === 2 ? true : undefined, user_id: mode === 0 ? contextApp.user && contextApp.user._id : undefined, ...cartoonFilter }, seed: 10000000000000, skip: cartoon.length, limit: 10 })
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

  const initCartoon = async () => {
    await onFetchCartoon()
  }

  React.useEffect(() => {
    if (cartoon.length >= 10 && cartoonLoadEnable === true && cartoonLoading !== true && scrollElementRef.current) {
      const observer = new IntersectionObserver(en => {
        if (en[0].intersectionRatio > 0) onFetchCartoonScroll()
      })
      observer.observe(scrollElementRef.current)
      return () => observer.disconnect()
    }
  }, [cartoon, cartoonLoadEnable, cartoonLoading])

  React.useEffect(() => { initCartoon() }, [mode, cartoonFilter])

  const Component =
    <div>
      <div style={{ display: 'flex', gap: 4, width: '100%', marginBottom: 24 }}>
        <div style={{ flexGrow: 1, flexShrink: 1, display: 'flex', alignItems: 'center', gap: 4, overflowY: 'auto' }}>
          {
            ComponentType
          }
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
        cartoonLoadEnable === false && cartoon.length === 0 ?
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
    </div >

  return Component
}

function User(props) {
  const user = props.user
  const onRefresh = props.onRefresh

  const contextApp = React.useContext(ContextApp)

  const [typeMode, setTypeMode] = React.useState(0)

  const [followLoading, setFollowLoading] = React.useState(false)

  const { scrollTop } = useScroll({ time: 1000 })
  const { active } = useActivation()

  const onCopy = async (text) => {
    await copy(text)
      .then(() => {
        contextApp.messageArrayAction.add('已复制到剪贴板')
      })
      .catch(() => {
        contextApp.messageArrayAction.add('复制失败')
      })
  }

  const onFollow = async () => {
    setFollowLoading(true)

    if (user.followed === true) {
      await Fetch.json('/api/app/user/update/user/follow', { user_id: props.user._id, follow: false })
        .then(() => {
          contextApp.messageArrayAction.add('已取消关注')
        })
        .catch(res => {
          contextApp.messageArrayAction.add('取消关注失败')
        })

    }

    if (user.followed !== true) {
      await Fetch.json('/api/app/user/update/user/follow', { user_id: props.user._id, follow: true })
        .then(() => {
          contextApp.messageArrayAction.add('已关注')
        })
        .catch(res => {
          contextApp.messageArrayAction.add('关注失败')
        })
    }

    await onRefresh()

    setFollowLoading(false)
  }

  const onScrollTop = () => {
    document.documentElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  const ComponentType =
    <div style={{ display: 'flex', gap: 8 }}>
      <Button style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 14 }} color='primary' variant={typeMode === 0 ? 'contained' : 'text'} onClick={() => setTypeMode(0)}>图集</Button>
      <Button style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 14 }} color='primary' variant={typeMode === 1 ? 'contained' : 'text'} onClick={() => setTypeMode(1)}>漫画</Button>
    </div>

  const Component =
    <>

      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 880 }}>
          <div style={{ width: '100%', maxHeight: 300, aspectRatio: '5 / 2', position: 'relative' }}>
            {
              user.background !== '' ?
                <>
                  <Image
                    src={user.background}
                    mode='BackgroundCover'
                    loadingSize={32}
                    style={{ width: '100%', height: 'calc(100% + 60px)', position: 'absolute', left: 0, top: 0, borderRadius: '0px 0px 16px 16px', overflow: 'hidden', boxShadow: '0px -4px 12px gray' }}
                  />
                </>
                : null
            }
            {
              user.background === '' ?
                <>
                  <div style={{ width: '100%', height: 'calc(100% + 60px)', position: 'absolute', left: 0, top: 0, borderRadius: '0px 0px 16px 16px', overflow: 'hidden', backgroundColor: 'rgba(25, 75, 75, 0.5)', backgroundSize: 'cover', backgroundPosition: 'center center', overflow: 'hidden' }} />
                </>
                : null
            }
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', padding: 24, paddingTop: 0, paddingBottom: 96 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8 }} >
              <div style={{ padding: 10, borderRadius: '50%', background: 'white' }}>
                <Image
                  lazy
                  src={user.avatar || undefined}
                  mode='Avatar'
                  loadingSize={16}
                  style={{ width: 100, height: 100 }}
                />
              </div>
              <Typography color='primary' style={{ fontSize: 24 }}>{user.name || '未命名'}</Typography>
              <Button color='primary' variant='outlined' size='small' style={{ fontSize: 12, cursor: 'pointer' }} onClick={() => onCopy(user._id)}>ID {user._id}</Button>
            </div>

            {
              user.self !== true ?
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  {
                    followLoading === true ?
                      <>
                        <Button variant='contained' color='primary' style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 14 }}><CircularProgress size={19} style={{ color: 'white', margin: 2.5 }} /></Button>
                      </>
                      : null
                  }
                  {
                    followLoading !== true ?
                      <>
                        {
                          user.followed === true ?
                            <>
                              <Button variant='contained' color='primary' style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 14, opacity: 0.5 }} onClick={() => onFollow(false)}>取消关注</Button>
                            </>
                            : null
                        }
                        {
                          user.followed !== true ?
                            <>
                              <Button variant='contained' color='primary' style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 14 }} onClick={() => onFollow(true)}>关注</Button>
                            </>
                            : null
                        }
                      </>
                      : null
                  }
                </div>
                : null
            }

            {
              user.description !== '' ?
                <Typography color='primary' style={{ fontSize: 14, width: '100%', padding: '16px 0px', borderTop: `1px dashed ${contextApp.theme.palette.primary.main}`, borderBottom: `1px dashed ${contextApp.theme.palette.primary.main}` }}>
                  {user.description}
                </Typography>
                : null
            }
            {
              user.description === '' ?
                <div style={{ width: '100%', borderTop: `1px dashed ${contextApp.theme.palette.primary.main}` }}></div>
                : null
            }

            <div>
              {
                typeMode === 0 ? <TabAlbum ComponentType={ComponentType}/> : null
              }
              {
                typeMode === 1 ? <TabCartoon ComponentType={ComponentType}/> : null
              }
            </div>
          </div>
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

function App() {
  const params = ReactRouterDom.useParams()

  const contextApp = React.useContext(ContextApp)

  const [user, setUser] = React.useState()
  const [userLoading, setUserLoading] = React.useState(false)

  const onFetchUser = async () => {
    setUserLoading(true)

    await Fetch.json('/api/app/user/find', { user_id: params._id })
      .then(res => {
        setUser(res.data)
      })
      .catch(res => {
        contextApp.messageArrayAction.add('检索用户内容失败')
      })

    await new Promise(resolve => setTimeout(() => resolve(), 500))

    setUserLoading(false)
  }

  const onFetchUserRefresh = async () => {
    await Fetch.json('/api/app/user/find', { user_id: params._id })
      .then(res => {
        setUser(res.data)
      })
      .catch(res => {
        contextApp.messageArrayAction.add('检索用户内容失败')
      })
  }

  React.useEffect(() => { onFetchUser() }, [params._id])

  ReactActivation.useActivate(() => { onFetchUserRefresh() })

  const Component =
    <>
      {
        userLoading !== true ?
          <>
            {
              user !== undefined && user._id === params._id ?
                <>
                  <User user={user} onRefresh={onFetchUserRefresh} />
                </>
                : null
            }
            {
              user === undefined ?
                <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                  <Avatar src={AvatarEmpty} style={{ width: 48, height: 48 }} />
                  <Button>查询不到当前作者</Button>
                </div>
                : null
            }
          </>
          : null
      }
      {
        userLoading === true ?
          <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress color='primary' size={32} />
          </div>
          : null
      }
    </>

  return Component
}

export default App