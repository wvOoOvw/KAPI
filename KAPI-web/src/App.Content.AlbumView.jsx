import React from 'react'
import * as ReactRouterDom from "react-router-dom"
import * as ReactActivation from "react-activation"

import Masonry from 'react-masonry-css'

import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'

import CopyAllIcon from '@mui/icons-material/CopyAll'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'

import { useResize } from './App.ComponentHookPure.Resize'
import { Image } from './App.ComponentPure.Image'

import { Context as ContextApp } from './App'

import { Fetch, urlDecode } from './utils.fetch'
import { copy } from './utils.copy'

import AvatarEmpty from '../static/image/AvatarEmpty.jpg'
import PosterEmpty from '../static/image/PosterEmpty.jpg'

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
                mode='BackgroundCover'
                loadingSize={32}
                styleImageVisible={{ width: '100%', aspectRatio: '1 / 1' }}
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
    <Masonry
      breakpointCols={2}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
      style={{ width: '100%', margin: 0 }}
    >
      {
        album.map((i) => <AlbumMasonryItem key={i._id} album={i} />)
      }
    </Masonry>

  return Component
}

function AlbumView(props) {
  const navigate = ReactRouterDom.useNavigate()

  const album = props.album
  const albumRecent = props.albumRecent
  const onRefresh = props.onRefresh

  const contextApp = React.useContext(ContextApp)

  const [viewImageLinkIndex, setViewIndex] = React.useState(0)
  const [viewImageSize, setViewImageSize] = React.useState()
  const [favoriteLoading, setFavoriteLoading] = React.useState(false)
  const [followLoading, setFollowLoading] = React.useState(false)
  const [payLoading, setPayLoading] = React.useState(false)

  const { size: screenSize } = useResize()

  const viewImageLink = React.useMemo(() => {
    if (album.paidContent.downloadMode === 'Internal' && (album.paid === true || album.own === true)) {
      return album.paidContent.downloadContent.map(i => i.downloadFileLink)
    }
    if (album.paidContent.downloadMode !== 'Internal' || (album.paid !== true && album.own !== true)) {
      return album.preview.map(i => i.previewFileLink)
    }
    return []
  }, [album.paidContent, album.paid, album.own])

  const paneStyleWidth = React.useMemo(() => {
    if (viewImageSize && screenSize) {
      var a = 480
      var b = 320
      var max = Math.min(1200, screenSize.width)
      var gap = 72

      a = a * (viewImageSize.width / viewImageSize.height)

      if (a > max - b - gap) a = max - b - gap
      if (a < 480) a = 480

      if (b > max - a - gap) b = a
      if (b < 320) b = 320

      return [a, b]
    }
    if (viewImageSize === undefined || screenSize === undefined) {
      return [undefined, undefined]
    }
  }, [viewImageSize, screenSize])

  const onFavorite = async () => {
    setFavoriteLoading(true)

    if (album.favorited === true) {
      await Fetch.json('/api/app/user/update/album/favorite', { album_id: album._id, favorite: false })
        .then(() => {
          contextApp.messageArrayAction.add('已取消收藏')
        })
        .catch(res => {
          contextApp.messageArrayAction.add(res.message || '取消收藏失败')
        })
    }

    if (album.favorited !== true) {
      await Fetch.json('/api/app/user/update/album/favorite', { album_id: album._id, favorite: true })
        .then(() => {
          contextApp.messageArrayAction.add('已收藏')
        })
        .catch(res => {
          contextApp.messageArrayAction.add(res.message || '收藏失败')
        })
    }

    await onRefresh()

    setFavoriteLoading(false)
  }

  const onPay = async () => {
    setPayLoading(true)

    await Fetch.json('/api/app/user/update/album/pay', { album_id: album._id })
      .then(() => {
        contextApp.messageArrayAction.add('解锁成功')
      })
      .catch(res => {
        contextApp.messageArrayAction.add(res.message || '解锁失败')
        contextApp.dialogsArrayAction.add('Coin')
      })

    await onRefresh()

    if (album.paidContent.downloadMode === 'Internal') {
      setViewIndex(0)
      contextApp.messageArrayAction.add('已刷新完整内容')
    }
    if (album.paidContent.downloadMode === 'External') {
      contextApp.dialogsArrayAction.add('Confirm', { content: '点击【解压教程】查看如何下载和解压' })
    }

    setPayLoading(false)
  }

  const onFollow = async () => {
    setFollowLoading(true)

    if (album.user.followed === true) {
      await Fetch.json('/api/app/user/update/user/follow', { user_id: album.user._id, follow: false })
        .then(() => {
          contextApp.messageArrayAction.add('已取消关注')
        })
        .catch(res => {
          contextApp.messageArrayAction.add('取消关注失败')
        })
    }

    if (album.user.followed !== true) {
      await Fetch.json('/api/app/user/update/user/follow', { user_id: album.user._id, follow: true })
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

  const onUser = () => {
    navigate(`/user/${album.user._id}`)
  }

  const onContact = () => {
    contextApp.dialogsArrayAction.add('Contact', { defaultTab: 1 })
  }

  const onDecode = (params) => {
    contextApp.dialogsArrayAction.add('Decode', { password: params.compressPassword })
  }

  const onDecodeGuide = (params) => {
    contextApp.dialogsArrayAction.add('DecodeGuide', { ...params, album: album })
  }

  const onPreviewTip = () => {
    document.getElementById('download').scrollIntoView(
      {
        block: 'center',
        behavior: 'smooth',
      }
    )
    contextApp.messageArrayAction.add('在 “下载” 解锁全部内容')
  }

  const onDecodeType = (params) => {
    if (params.type === 'baidu-7z') {
      contextApp.messageArrayAction.add('文件名后缀改成.7Z后解压')
    }
    if (params.type === 'baidu-zip') {
      contextApp.messageArrayAction.add('文件名后缀改成.ZIP后解压')
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

  const onDownloadOne = async () => {
    const base64 = await Fetch.textUnauth(viewImageLink[viewImageLinkIndex])
    const a = document.createElement('a')
    a.href = `${base64}`
    a.download = `${album.name + ' ' + viewImageLinkIndex}.jpg`
    a.click()
    a.remove()
  }

  const onDownloadAll = async () => {
    for (let i = 0; i < viewImageLink.length; i++) {
      await onDownloadOne()
    }
  }

  const Component =
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: paneStyleWidth[0] === paneStyleWidth[1] ? 0 : 32, padding: '0px 24px', paddingBottom: 96, display: viewImageSize && screenSize ? 'flex' : 'none' }}>
      <div style={{ width: paneStyleWidth[0], maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Paper style={{ width: '100%', borderRadius: '0px 0px 24px 24px', overflow: 'hidden', position: 'relative' }}>
            {
              viewImageLink.length > 0 ?
                <>
                  <Image
                    cardActionArea
                    src={viewImageLink[viewImageLinkIndex]}
                    mode='Image'
                    loadingSize={32}
                    styleImageVisible={{ width: '100%' }}
                    styleImageInvisible={{ width: 420, maxWidth: '100%', aspectRatio: '1 / 1' }}
                    onClick={() => contextApp.dialogsArrayAction.add('ImageView', { image: viewImageLink[viewImageLinkIndex] })}
                    onCallbackSize={size => setViewImageSize(size)}
                  />
                  {
                    album.paid !== true ? <Button fullWidth variant='contained' component='div' color='inherit' style={{ minWidth: 'unset', padding: '8px 12px', fontSize: 14, opacity: 0.75, position: 'absolute', bottom: 0 }} onClick={onPreviewTip}>解锁全部内容</Button> : null
                  }
                </>
                : null
            }
            {
              viewImageLink.length === 0 ?
                <>
                  <Image
                    cardActionArea
                    src={PosterEmpty}
                    mode='Image'
                    loadingSize={32}
                    styleImageVisible={{ width: '100%' }}
                    styleImageInvisible={{ width: 420, maxWidth: '100%', aspectRatio: '1 / 1' }}
                    onCallbackSize={size => setViewImageSize(size)}
                  />
                  {
                    album.paid !== true ? <Button fullWidth variant='contained' component='div' color='inherit' style={{ minWidth: 'unset', padding: '8px 12px', fontSize: 14, opacity: 0.75, position: 'absolute', bottom: 0 }} onClick={onPreviewTip}>解锁全部内容</Button> : null
                  }
                  <Button variant='contained' component='div' color='inherit' style={{ minWidth: 'unset', padding: '4px 12px', fontSize: 12, opacity: 0.75, position: 'absolute', top: 8, right: 8 }}>暂无预览图</Button>
                </>
                : null
            }
          </Paper>

          {
            viewImageLink.length > 1 ?
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button disabled={viewImageLinkIndex === 0} onClick={() => setViewIndex(i => i - 1)}><KeyboardArrowLeftIcon />上一页</Button>
                <Typography color='primary' style={{ fontSize: 14 }}>{viewImageLinkIndex + 1} / {viewImageLink.length}</Typography>
                <Button disabled={viewImageLinkIndex === viewImageLink.length - 1} onClick={() => setViewIndex(i => i + 1)}>下一页<KeyboardArrowRightIcon /></Button>
              </div>
              : null
          }
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Typography variant='body1' style={{ fontSize: 10, opacity: 0.5 }}>图集ID：{album._id}</Typography>
            <CopyAllIcon style={{ width: 10, height: 10, cursor: 'pointer' }} onClick={() => onCopy(album._id)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <Typography color='primary' variant='body1' style={{ fontSize: 20 }}>{album.name}</Typography>
            {
              favoriteLoading !== true && album.favorited === true ? <Button variant='text' color='primary' style={{ minWidth: 'unset', padding: 4, color: 'gray' }} onClick={onFavorite}><StarIcon color='primary' style={{ width: 24, height: 24 }} /></Button> : null
            }
            {
              favoriteLoading !== true && album.favorited !== true ? <Button variant='text' color='primary' style={{ minWidth: 'unset', padding: 4, color: 'gray' }} onClick={onFavorite}><StarBorderIcon color='primary' style={{ width: 24, height: 24 }} /></Button> : null
            }
            {
              favoriteLoading === true ? <Button variant='text' color='primary' style={{ minWidth: 'unset', padding: 4, color: 'gray', fontSize: 12 }}><CircularProgress color='primary' size={24} /></Button> : null
            }
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {
              album.description ? <Typography color='primary' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: 12 }}>{album.description}</Typography> : null
            }
            {
              album.tag.length > 0 || album.actor.length > 0 ?
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {
                    album.tag.map((i, index) => {
                      return <Typography key={index} color='primary' style={{ fontSize: 12 }}>#{i}</Typography>
                    })
                  }
                  {
                    album.actor.map((i, index) => {
                      return <Typography key={index} color='primary' style={{ fontSize: 12 }}>#{i}</Typography>
                    })
                  }
                </div>
                : null
            }
          </div>
        </div>
      </div>

      <div style={{ width: paneStyleWidth[1], maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 32, marginTop: paneStyleWidth[0] === paneStyleWidth[1] ? 32 : 24 }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Typography color='primary' variant='body1' style={{ fontSize: 20 }}>作者</Typography>
          {
            album.user ?
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                {
                  album.user.status === 1 ?
                    <Button style={{ minWidth: 'unset', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 8 }} onClick={onUser}>
                      <Image
                        lazy
                        src={album.user.avatar || undefined}
                        mode='Avatar'
                        loadingSize={16}
                        style={{ width: 36, height: 36 }}
                      />
                      <Typography variant='body2' style={{ fontSize: 14, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{album.user.name}</Typography>
                    </Button>
                    : null
                }
                {
                  album.user.status !== 1 ?
                    <Button style={{ minWidth: 'unset', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 8 }} onClick={onUser}>
                      <Avatar src={undefined} style={{ width: 36, height: 36 }} />
                    </Button>
                    : null
                }
                {
                  album.user.status === 1 && album.user.self !== true ?
                    <div style={{ flexShrink: 0 }}>
                      {
                        followLoading === true ?
                          <>
                            <Button variant='contained' color='primary' style={{ minWidth: 'unset', padding: '4px 12px', fontSize: 12 }}><CircularProgress size={16} style={{ color: 'white', margin: 2.5 }} /></Button>
                          </>
                          : null
                      }
                      {
                        followLoading !== true ?
                          <>
                            {
                              album.user.followed === true ?
                                <>
                                  <Button variant='contained' color='primary' style={{ minWidth: 'unset', padding: '4px 12px', fontSize: 12, opacity: 0.5 }} onClick={() => onFollow(false)}>取消关注</Button>
                                </>
                                : null
                            }
                            {
                              album.user.followed !== true ?
                                <>
                                  <Button variant='contained' color='primary' style={{ minWidth: 'unset', padding: '4px 12px', fontSize: 12 }} onClick={() => onFollow(true)}>关注</Button>
                                </>
                                : null
                            }
                          </>
                          : null
                      }
                    </div>
                    : null
                }
              </div>
              : null
          }
        </div>

        {
          album.paidContent.downloadMode !== 'none' ?
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Typography color='primary' variant='body1' style={{ fontSize: 20 }} id='download'>下载</Typography>
              {
                album.paid === true || album.own === true ?
                  <>
                    {
                      album.paidContent.downloadMode === 'External' ?
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {
                            album.paidContent.downloadContent.map((i, index) => {
                              return <Card key={index}>
                                <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '24px 16px' }}>
                                  {
                                    i.downloadExternalChannel === 'BaiduDisk' ?
                                      <>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant='body2' style={{ fontSize: 14, opacity: 0.5 }}>下载链接</Typography>
                                            <CopyAllIcon style={{ width: 14, height: 14, cursor: 'pointer' }} onClick={() => onCopy(i.downloadExternalLink)} />
                                          </div>
                                          <Button variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => window.open(i.downloadExternalLink)}>{i.downloadExternalLink}</Button>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant='body2' style={{ fontSize: 14, opacity: 0.5 }}>提取密码</Typography>
                                            <CopyAllIcon style={{ width: 14, height: 14, cursor: 'pointer' }} onClick={() => onCopy(i.downloadExternalLinkPassword)} />
                                          </div>
                                          <Button variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => onCopy(i.downloadExternalLinkPassword)}>{i.downloadExternalLinkPassword}</Button>
                                        </div>
                                      </>
                                      : null
                                  }
                                  {
                                    i.needCompress ?
                                      <>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant='body2' style={{ fontSize: 14, opacity: 0.5 }}>解压格式</Typography>
                                          </div>
                                          <Button variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => onDecodeType(i)}>{i.compressMode}</Button>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant='body2' style={{ fontSize: 14, opacity: 0.5 }}>解压密码</Typography>
                                            <CopyAllIcon style={{ width: 14, height: 14, cursor: 'pointer' }} onClick={() => onCopy(i.compressPassword)} />
                                          </div>
                                          <Button variant='text' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block', textAlign: 'left', textTransform: 'none', fontSize: 12 }} onClick={() => onCopy(i.compressPassword)}>{i.compressPassword}</Button>
                                        </div>
                                      </>
                                      : null
                                  }
                                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                    {
                                      i.needCompress && i.compressMode === 'ZIP' ?
                                        <>
                                          <Button variant='contained' style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => onDecode(i)}>在线解压</Button>
                                        </>
                                        : null
                                    }
                                    {
                                      i.needCompress ?
                                        <>
                                          <Button variant='contained' style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => onDecodeGuide(i)}>解压教程</Button>
                                        </>
                                        : null
                                    }
                                    <Button variant='contained' style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => onContact()}>联系客服</Button>
                                  </div>
                                </CardContent>
                              </Card>
                            })
                          }
                        </div>
                        : null
                    }

                    {
                      album.paidContent.downloadMode === 'Internal' ?
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                          <Button fullWidth variant='contained' style={{ fontSize: 12 }} onClick={onDownloadOne}>下载当前</Button>
                          <Button fullWidth variant='contained' style={{ fontSize: 12 }} onClick={onDownloadAll}>下载全部</Button>
                        </div>
                        : null
                    }
                  </>
                  : null
              }
              {
                album.paid !== true && album.own !== true ?
                  <>
                    {
                      payLoading === true ?
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                          <CircularProgress color='primary' size={32} />
                        </div>
                        : null
                    }
                    {
                      payLoading !== true ?
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                          <Button fullWidth variant='contained' style={{ fontSize: 12 }} onClick={onPay}>消耗 {album.price} 硬币解锁</Button>
                        </div>
                        : null
                    }
                  </>
                  : null
              }
            </div>
            : null
        }

        {
          albumRecent.length > 0 ?
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Typography color='primary' variant='body1' style={{ fontSize: 20 }}>相关作品</Typography>
              <AlbumMasonry album={albumRecent} />
            </div>
            : null
        }
      </div>
    </div>

  return Component
}

function App() {
  const params = ReactRouterDom.useParams()

  const contextApp = React.useContext(ContextApp)

  const [album, setAlbum] = React.useState()
  const [albumRecent, setAlbumRecent] = React.useState([])
  const [albumLoading, setAlbumLoading] = React.useState(true)

  const onFetchAlbum = async () => {
    setAlbumLoading(true)

    await Fetch.json('/api/app/album/find', { album_id: params._id })
      .then(res => {
        setAlbum(res.data)
      })
      .catch(res => {
        contextApp.messageArrayAction.add('查询错误')
      })

    await new Promise(resolve => setTimeout(() => resolve(), 500))

    setAlbumLoading(false)
  }

  const onFetchAlbumRefresh = async () => {
    await Fetch.json('/api/app/album/find', { album_id: params._id })
      .then(res => {
        setAlbum(res.data)
      })
      .catch(res => {
        contextApp.messageArrayAction.add('查询错误')
      })
  }

  const onFetchAlbumRecent = async () => {
    const seed = Math.round(Math.random() * 10000 + 1)

    await Fetch.json('/api/app/album/find/list', { filter: { user_id: album.user._id, status: 1, actor: album.actor }, seed: seed, skip: 0, limit: 8 })
      .then(res => {
        setAlbumRecent(res.data)
      })
  }

  React.useEffect(() => { onFetchAlbum() }, [params._id])

  React.useEffect(() => {
    if (album && albumRecent.length === 0) onFetchAlbumRecent()
  }, [album])

  ReactActivation.useActivate(() => { onFetchAlbumRefresh() })

  const Component =
    <>
      {
        albumLoading !== true ?
          <>
            {
              album !== undefined && album._id === params._id ?
                <>
                  {
                    album.status === 1 || album.own === true ?
                      <>
                        <AlbumView album={album} albumRecent={albumRecent} onRefresh={onFetchAlbumRefresh} />
                      </>
                      : null
                  }
                  {
                    album.status !== 1 && album.own !== true ?
                      <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                        <Avatar src={AvatarEmpty} style={{ width: 48, height: 48 }} />
                        <Button>当前内容正在审核中</Button>
                      </div>
                      : null
                  }
                </>
                : null
            }
            {
              album === undefined ?
                <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                  <Avatar src={AvatarEmpty} style={{ width: 48, height: 48 }} />
                  <Button>查询不到当前内容</Button>
                </div>
                : null
            }
          </>
          : null
      }
      {
        albumLoading === true ?
          <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress color='primary' size={32} />
          </div>
          : null
      }
    </>

  return Component
}

export default App