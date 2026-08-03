import React from 'react'
import ReactDOM from 'react-dom'
import * as ReactRouterDom from "react-router-dom"
import * as ReactActivation from "react-activation"

import Masonry from 'react-masonry-css'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import CardActionArea from '@mui/material/CardActionArea'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Fab from '@mui/material/Fab'
import IconButton from '@mui/material/IconButton'

import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import CameraAltIcon from '@mui/icons-material/CameraAlt'

import { Image } from './App.ComponentPure.Image'
import { Resize } from './App.ComponentHookPure.Resize'
import { useScroll } from './App.ComponentHookPure.Scroll'
import { useActivation } from './App.ComponentHookPure.Activation'

import { Context as ContextApp } from './App'

import { Fetch } from './utils.fetch'
import { copy } from './utils.copy'

import PosterEmpty from '../static/image/PosterEmpty.jpg'
import AvatarEmpty from '../static/image/AvatarEmpty.jpg'

function UserListItem(props) {
  const user = props.user
  const onRefresh = props.onRefresh

  const navigate = ReactRouterDom.useNavigate()

  const contextApp = React.useContext(ContextApp)

  const [favoriteLoading, setFavoriteLoading] = React.useState(false)

  const onFollow = async () => {
    setFavoriteLoading(true)

    if (user.followed === true) {
      await Fetch.json('/api/app/user/update/user/follow', { user_id: props.user._id, follow: false })
        .then(() => {
          contextApp.messageArrayAction.add('已取消关注')
        })
        .catch(res => {
          contextApp.messageArrayAction.add(res.message || '取消关注失败')
        })
    }

    if (user.followed !== true) {
      await Fetch.json('/api/app/user/update/user/follow', { user_id: props.user._id, follow: true })
        .then(() => {
          contextApp.messageArrayAction.add('已关注')
        })
        .catch(res => {
          contextApp.messageArrayAction.add(res.message || '关注失败')
        })
    }

    await onRefresh(user._id)

    setFavoriteLoading(false)
  }

  const Component =
    <ListItem disablePadding>
      <ListItemButton onClick={() => navigate(`/user/${user._id}`)}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 0, flexGrow: 1, overflow: 'hidden' }}>
            <Image
              lazy
              src={user.avatar || undefined}
              mode='Avatar'
              loadingSize={24}
              style={{ width: 36, height: 36, flexShrink: 0 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 0, flexGrow: 1, overflow: 'hidden' }}>
              <Typography color='primary' variant='body2'>{user.name || '未命名'}</Typography>
              <Typography color='primary' variant='body2' style={{ fontSize: 10, opacity: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.description || '用户很懒，什么都没有留下。'}</Typography>
            </div>
          </div>

          <div style={{ flexShrink: 0 }}>
            {
              favoriteLoading === true ?
                <>
                  <Button variant='contained' color='primary' style={{ minWidth: 'unset', padding: '4px 12px', fontSize: 12 }}><CircularProgress size={16} style={{ color: 'white', margin: 2.5 }} /></Button>
                </>
                : null
            }
            {
              favoriteLoading !== true ?
                <>
                  {
                    user.followed === true ?
                      <>
                        <Button variant='contained' style={{ minWidth: 'unset', padding: '4px 12px', fontSize: 12, opacity: 0.5 }} onClick={(e) => { e.stopPropagation(); onFollow(false); }}>取消关注</Button>
                      </>
                      : null
                  }
                  {
                    user.followed !== true ?
                      <>
                        <Button variant='contained' color='primary' style={{ minWidth: 'unset', padding: '4px 12px', fontSize: 12 }} onClick={(e) => { e.stopPropagation(); onFollow(true); }}>关注</Button>
                      </>
                      : null
                  }
                </>
                : null
            }
          </div>
        </div>
      </ListItemButton>
    </ListItem>

  return Component
}

function UserList(props) {
  const user = props.user
  const onRefresh = props.onRefresh

  const Component =
    <div style={{ width: '100%' }}>
      <List>
        {
          user.map((i) => {
            return <UserListItem key={i._id} user={i} onRefresh={onRefresh} />
          })
        }
      </List>
    </div>

  return Component
}

function CartoonMasonryItem(props) {
  const cartoon = props.cartoon
  const statusMode = props.statusMode
  const onRefresh = props.onRefresh

  const navigate = ReactRouterDom.useNavigate()

  const contextApp = React.useContext(ContextApp)

  const onEdit = () => {
    contextApp.dialogsArrayAction.add('CartoonInformationOperation', { _id: cartoon._id, onRefresh: async () => await onRefresh(cartoon) })
  }

  const onDelete = () => {
    const onConfirm = async () => {
      contextApp.loadingArrayAction.add('CartoonInformationDelete')

      await Fetch.json('/api/app/cartoon/delete', { cartoon_id: cartoon._id })
        .then(res => {
          contextApp.messageArrayAction.add('删除成功')
        })
        .catch(res => {
          contextApp.messageArrayAction.add(res.message || '系统异常')
        })

      contextApp.loadingArrayAction.remove('CartoonInformationDelete')

      onRefresh(cartoon)
    }

    contextApp.dialogsArrayAction.add('Confirm', { content: '是否确认删除当前作品', onConfirm: onConfirm })
  }

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
      {
        statusMode === 0 ?
          <CardActions style={{ padding: '6px 8px' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
              <Button style={{ minWidth: 'unset', padding: 4 }} variant='text' color='primary' onClick={onDelete}><DeleteIcon color='primary' style={{ width: 16, height: 16 }} /></Button>
              <Button style={{ minWidth: 'unset', padding: 4 }} variant='text' color='primary' onClick={onEdit}><EditIcon color='primary' style={{ width: 16, height: 16 }} /></Button>
            </div>
          </CardActions>
          : null
      }
    </Card>

  return Component
}

function CartoonMasonry(props) {
  const cartoon = props.cartoon
  const statusMode = props.statusMode
  const onRefresh = props.onRefresh

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
                    cartoon.map((i) => <CartoonMasonryItem key={i._id} cartoon={i} statusMode={statusMode} onRefresh={onRefresh} />)
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

function AlbumMasonryItem(props) {
  const album = props.album
  const statusMode = props.statusMode
  const onRefresh = props.onRefresh

  const navigate = ReactRouterDom.useNavigate()

  const contextApp = React.useContext(ContextApp)

  const onEdit = () => {
    contextApp.dialogsArrayAction.add('AlbumInformationOperation', { _id: album._id, onRefresh: async () => await onRefresh(album) })
  }

  const onDelete = () => {
    const onConfirm = async () => {
      contextApp.loadingArrayAction.add('AlbumInformationDelete')

      await Fetch.json('/api/app/album/delete', { album_id: album._id })
        .then(res => {
          contextApp.messageArrayAction.add('删除成功')
        })
        .catch(res => {
          contextApp.messageArrayAction.add(res.message || '系统异常')
        })

      contextApp.loadingArrayAction.remove('AlbumInformationDelete')

      onRefresh(album)
    }

    contextApp.dialogsArrayAction.add('Confirm', { content: '是否确认删除当前作品', onConfirm: onConfirm })
  }

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
      {
        statusMode === 0 ?
          <CardActions style={{ padding: '6px 8px' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
              <Button style={{ minWidth: 'unset', padding: 4 }} variant='text' color='primary' onClick={onDelete}><DeleteIcon color='primary' style={{ width: 16, height: 16 }} /></Button>
              <Button style={{ minWidth: 'unset', padding: 4 }} variant='text' color='primary' onClick={onEdit}><EditIcon color='primary' style={{ width: 16, height: 16 }} /></Button>
            </div>
          </CardActions>
          : null
      }
    </Card>

  return Component
}

function AlbumMasonry(props) {
  const album = props.album
  const statusMode = props.statusMode
  const onRefresh = props.onRefresh

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
                    album.map((i) => <AlbumMasonryItem key={i._id} album={i} statusMode={statusMode} onRefresh={onRefresh} />)
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

function TabCartoon(props) {
  const typeMode = props.typeMode
  const statusMode = props.statusMode
  const ComponentTab = props.ComponentTab

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

    await Fetch.json('/api/app/cartoon/find/list', { filter: { favorited: statusMode === 1 ? true : undefined, paid: statusMode === 2 ? true : undefined, user_id: statusMode === 0 ? contextApp.user._id : undefined, ...cartoonFilter }, seed: 10000000000000, skip: 0, limit: 10 })
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

    await Fetch.json('/api/app/cartoon/find/list', { filter: { favorited: statusMode === 1 ? true : undefined, paid: statusMode === 2 ? true : undefined, user_id: statusMode === 0 ? contextApp.user._id : undefined, ...cartoonFilter }, seed: 10000000000000, skip: cartoon.length, limit: 10 })
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

  const onFetchCartoonRefresh = async (cartoon) => {
    setCartoonLoading(true)

    await Fetch.json('/api/app/cartoon/find', { cartoon_id: cartoon._id })
      .then(res => {
        setCartoon(i => i.map(n => n._id === res.data._id ? res.data : n))
      })
      .catch(res => {
        setCartoon(i => i.filter(n => n._id !== cartoon._id))
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

  React.useEffect(() => { initCartoon() }, [statusMode, cartoonFilter])

  const Component =
    <div>
      <div style={{ display: 'flex', gap: 4, width: '100%', marginBottom: 24 }}>
        <div style={{ flexGrow: 1, flexShrink: 1, display: 'flex', alignItems: 'center', gap: 4, overflowY: 'auto' }}>
          {
            ComponentTab
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
        cartoon.length !== 0 ? <CartoonMasonry cartoon={cartoon} statusMode={statusMode} onRefresh={onFetchCartoonRefresh} /> : null
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

function TabAlbum(props) {
  const typeMode = props.typeMode
  const statusMode = props.statusMode
  const ComponentTab = props.ComponentTab

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

    await Fetch.json('/api/app/album/find/list', { filter: { favorited: statusMode === 1 ? true : undefined, paid: statusMode === 2 ? true : undefined, user_id: statusMode === 0 ? contextApp.user._id : undefined, ...albumFilter }, seed: 10000000000000, skip: 0, limit: 10 })
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

    await Fetch.json('/api/app/album/find/list', { filter: { favorited: statusMode === 1 ? true : undefined, paid: statusMode === 2 ? true : undefined, user_id: statusMode === 0 ? contextApp.user._id : undefined, ...albumFilter }, seed: 10000000000000, skip: album.length, limit: 10 })
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

  const onFetchAlbumRefresh = async (album) => {
    setAlbumLoading(true)

    await Fetch.json('/api/app/album/find', { album_id: album._id })
      .then(res => {
        setAlbum(i => i.map(n => n._id === res.data._id ? res.data : n))
      })
      .catch(res => {
        setAlbum(i => i.filter(n => n._id !== album._id))
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

  React.useEffect(() => { initAlbum() }, [statusMode, albumFilter])

  const Component =
    <div>
      <div style={{ display: 'flex', gap: 4, width: '100%', marginBottom: 24 }}>
        <div style={{ flexGrow: 1, flexShrink: 1, display: 'flex', alignItems: 'center', gap: 4, overflowY: 'auto' }}>
          {
            ComponentTab
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
        album.length !== 0 ? <AlbumMasonry album={album} statusMode={statusMode} onRefresh={onFetchAlbumRefresh} /> : null
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

function TabUser(props) {
  const userId = props.userId

  const contextApp = React.useContext(ContextApp)

  const [user, setUser] = React.useState([])
  const [userLoadEnable, setUserLoadEnable] = React.useState(true)
  const [userLoading, setUserLoading] = React.useState(false)

  const scrollElementRef = React.useRef()

  const onFetchUser = async () => {
    setUser([])
    setUserLoadEnable(true)
    setUserLoading(true)

    await Fetch.json('/api/app/user/find/list', { filter: { favorited: true, status: [1] }, skip: 0, limit: 10 })
      .then(res => {
        setUser(res.data)
        if (res.data.length !== 0) setUserLoadEnable(true)
        if (res.data.length === 0) setUserLoadEnable(false)
      })
      .catch(res => {
        if (contextApp.tabPage === 0) contextApp.messageArrayAction.add('检索内容失败')
      })

    setUserLoading(false)
  }

  const onFetchUserScroll = async () => {
    setUserLoading(true)

    await Fetch.json('/api/app/user/find/list', { filter: { favorited: true, status: [1] }, skip: user.length, limit: 10 })
      .then(res => {
        setUser(i => [...i, ...res.data])
        if (res.data.length === 0) setUserLoadEnable(false)
        if (res.data.length === 0) contextApp.messageArrayAction.add('没有更多内容')
      })
      .catch(res => {
        if (contextApp.tabPage === 0) contextApp.messageArrayAction.add('检索内容失败')
      })

    setUserLoading(false)
  }

  const onFetchUserRefresh = async (user) => {
    setUserLoading(true)

    await Fetch.json('/api/app/user/find', { user_id: user._id })
      .then(res => {
        setUser(i => i.map(n => n._id === res.data._id ? res.data : n))
      })
      .catch(res => {
        setUser(i => i.filter(n => n._id !== user._id))
      })

    setUserLoading(false)
  }

  const initUser = async () => {
    await onFetchUser()
  }

  React.useEffect(() => {
    if (user.length >= 10 && userLoadEnable === true && userLoading !== true && scrollElementRef.current) {
      const observer = new IntersectionObserver(en => {
        if (en[0].intersectionRatio > 0) onFetchUserScroll()
      })
      observer.observe(scrollElementRef.current)
      return () => observer.disconnect()
    }
  }, [user, userLoadEnable, userLoading])

  React.useEffect(() => { initUser() }, [userId])

  const Component =
    <div>
      {
        user.length !== 0 ?
          <>
            <UserList user={user} onRefresh={onFetchUserRefresh} />
          </>
          : null
      }
      {
        userLoadEnable === false && user.length === 0 ?
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12, padding: 12, height: user.length === 0 ? 200 : 'fit-content' }}>
            <Typography color='primary' variant='body2' style={{ textAlign: 'center', fontSize: 12 }}>没有检索出内容</Typography>
            <Typography color='primary' variant='body2' style={{ textAlign: 'center', fontSize: 12, opacity: 0.5 }}>切换筛选条件后再试试</Typography>
          </div>
          : null
      }
      {
        userLoading === true ?
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 12, height: user.length === 0 ? 200 : 'fit-content' }}>
            <CircularProgress color='primary' size={32} />
          </div>
          : null
      }
      {
        userLoadEnable === true ? <div ref={el => scrollElementRef.current = el} /> : null
      }
    </div>

  return Component
}

function User(props) {
  const user = props.user
  const onRefresh = props.onRefresh

  const navigate = ReactRouterDom.useNavigate()

  const contextApp = React.useContext(ContextApp)

  const [typeMode, setTypeMode] = React.useState(0)
  const [statusMode, setStatusMode] = React.useState(0)

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

  const onExit = () => {
    const onConfirm = async () => {
      localStorage.removeItem('User_Authorization')
      contextApp.setUser()
      contextApp.messageArrayAction.add('退出成功')
      contextApp.dialogsArrayAction.remove('Confirm')
    }

    contextApp.dialogsArrayAction.add('Confirm', { content: '是否确认退出当前账号', onConfirm: onConfirm })

  }

  const onEdit = () => {
    contextApp.dialogsArrayAction.add('UserInformationOperation', { onRefresh: onRefresh })
  }

  const onSystem = () => {
    contextApp.dialogsArrayAction.add('SystemPick')
  }

  const onPublish = () => {
    contextApp.dialogsArrayAction.add('PublishPick')
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
      <Button style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 14 }} color='primary' variant={typeMode === 2 ? 'contained' : 'text'} onClick={() => setTypeMode(2)}>关注</Button>
    </div>

  const ComponentTab =
    <div style={{ display: 'flex', gap: 8 }}>
      <Button style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 14 }} color='primary' variant={statusMode === 0 ? 'contained' : 'text'} onClick={() => setStatusMode(0)}>作品</Button>
      <Button style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 14 }} color='primary' variant={statusMode === 1 ? 'contained' : 'text'} onClick={() => setStatusMode(1)}>收藏</Button>
      <Button style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 14 }} color='primary' variant={statusMode === 2 ? 'contained' : 'text'} onClick={() => setStatusMode(2)}>解锁</Button>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 30, height: 30 }}></div>
                <Typography color='primary' style={{ fontSize: 24 }}>{user.name || '未命名'}</Typography>
                <IconButton size='small' color='primary' onClick={onEdit}>
                  <EditIcon fontSize='small' />
                </IconButton>
              </div>
              <Button color='primary' variant='outlined' size='small' style={{ fontSize: 12 }} onClick={() => onCopy(user._id)}>ID {user._id}</Button>
            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 32 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Typography color='primary' variant='body2' style={{ fontSize: 20 }}>关注</Typography>
                <Typography color='primary' variant='body2' style={{ fontSize: 16 }}>{user.userFollowedCount}</Typography>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Typography color='primary' variant='body2' style={{ fontSize: 20 }}>粉丝</Typography>
                <Typography color='primary' variant='body2' style={{ fontSize: 16 }}>{user.followedCount}</Typography>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Typography color='primary' variant='body2' style={{ fontSize: 20 }}>硬币</Typography>
                <Typography color='primary' variant='body2' style={{ fontSize: 16 }}>{user.coin}</Typography>
              </div>
            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              {
                user.role === 'admin' ?
                  <>
                    <Button color='primary' variant='contained' style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 14 }} onClick={onSystem}><SettingsIcon style={{ marginRight: 4 }} />设置</Button>
                    <Button color='primary' variant='contained' style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 14 }} onClick={onPublish}><CameraAltIcon style={{ marginRight: 4 }} />发布</Button>
                  </>
                  : null
              }
              <Button color='primary' variant='contained' style={{ flexShrink: 0, minWidth: 'unset', padding: '4px 8px', fontSize: 14 }} onClick={onExit}><LogoutIcon style={{ marginRight: 4 }} />退出</Button>
            </div>

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

            {
              ComponentType
            }

            <div>
              {
                typeMode === 0 ?
                  <>
                    {
                      statusMode === 0 ? <TabAlbum key={statusMode} typeMode={typeMode} statusMode={statusMode} ComponentTab={ComponentTab} /> : null
                    }
                    {
                      statusMode === 1 ? <TabAlbum key={statusMode} typeMode={typeMode} statusMode={statusMode} ComponentTab={ComponentTab} /> : null
                    }
                    {
                      statusMode === 2 ? <TabAlbum key={statusMode} typeMode={typeMode} statusMode={statusMode} ComponentTab={ComponentTab} /> : null
                    }
                  </>
                  : null
              }

              {
                typeMode === 1 ?
                  <>
                    {
                      statusMode === 0 ? <TabCartoon key={statusMode} typeMode={typeMode} statusMode={statusMode} ComponentTab={ComponentTab} /> : null
                    }
                    {
                      statusMode === 1 ? <TabCartoon key={statusMode} typeMode={typeMode} statusMode={statusMode} ComponentTab={ComponentTab} /> : null
                    }
                    {
                      statusMode === 2 ? <TabCartoon key={statusMode} typeMode={typeMode} statusMode={statusMode} ComponentTab={ComponentTab} /> : null
                    }
                  </>
                  : null
              }

              {
                typeMode === 2 ? <TabUser /> : null
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
  const contextApp = React.useContext(ContextApp)

  const [user, setUser] = React.useState()
  const [userLoading, setUserLoading] = React.useState(true)

  const onFetchUser = async () => {
    setUserLoading(true)

    await Fetch.json('/api/app/user/find', { user_id: contextApp.user._id })
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
    await Fetch.json('/api/app/user/find', { user_id: contextApp.user._id })
      .then(res => {
        setUser(res.data)
      })
      .catch(res => {
        contextApp.messageArrayAction.add('检索用户内容失败')
      })
  }

  const initUser = async () => {
    if (contextApp.user && contextApp.user._id) await onFetchUser()
  }

  React.useEffect(() => { initUser() }, [contextApp.user])

  ReactActivation.useActivate(() => { if (contextApp.user && contextApp.user._id) onFetchUserRefresh() })

  const Component =
    <>
      {
        userLoading !== true ?
          <>
            {
              user !== undefined && user._id === contextApp.user._id ?
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