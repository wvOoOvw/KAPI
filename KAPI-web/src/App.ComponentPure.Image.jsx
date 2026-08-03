import React from 'react'

import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Avatar from '@mui/material/Avatar'

import BrokenImageIcon from '@mui/icons-material/BrokenImage'

import { useLoadImage } from './App.ComponentHookPure.LoadImage'

function ImageSuspense(props) {
  const Component =
    <>
      <div style={{ ...props.style }} ref={props.intersectionRef} />
    </>

  return Component
}

function ImageBroken(props) {
  const Component =
    <>
      {
        props.mode === 'Image' || props.mode === 'BackgroundCover' || props.mode === 'BackgroundContain' ?
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, ...props.style }}>
            <BrokenImageIcon style={{ opacity: 0.5 }} />
            <Typography variant='body2' style={{ fontSize: 12, color: 'black', opacity: 0.5 }}>图片加载失败</Typography>
          </div>
          : null
      }
      {
        props.mode === 'Avatar' ? <Avatar style={{ width: '100%', ...props.style }} src={undefined} /> : null
      }
    </>


  return Component
}

function ImageLoading(props) {
  const Component =
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ...props.style }}>
      <CircularProgress color='primary' size={props.loadingSize} />
    </div>

  return Component
}

function ImageContent(props) {
  const ImageRender =
    <>
      {
        props.mode === 'Image' ? <img style={{ width: '100%', height: '100%' }} src={props.src} /> : null
      }
      {
        props.mode === 'BackgroundCover' ? <div style={{ width: '100%', height: '100%', backgroundImage: `url(${props.src})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} /> : null
      }
      {
        props.mode === 'BackgroundContain' ? <div style={{ width: '100%', height: '100%', backgroundImage: `url(${props.src})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} /> : null
      }
      {
        props.mode === 'Avatar' ? <Avatar style={{ width: '100%', height: '100%' }} src={props.src} /> : null
      }
    </>

  const Loading =
    <>
      {
        props.loading ? <ImageLoading style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: 'rgba(255, 255, 255, 1)' }} loadingSize={props.loadingSize} /> : null
      }
    </>

  const Component =
    <>
      {
        props.cihldren === undefined ?
          <>
            {
              props.card === true && props.cardActionArea !== true ?
                <Card style={{ position: 'relative', ...props.style }} onClick={props.onClick} ref={props.intersectionRef}>
                  {
                    ImageRender
                  }
                  {
                    Loading
                  }
                </Card>
                : null
            }
            {
              props.card !== true && props.cardActionArea === true ?
                <CardActionArea style={{ position: 'relative', ...props.style }} onClick={props.onClick} component='div' ref={props.intersectionRef}>
                  {
                    ImageRender
                  }
                  {
                    Loading
                  }
                </CardActionArea>
                : null
            }
            {
              props.card === true && props.cardActionArea === true ?
                <Card style={{ position: 'relative', ...props.style }} onClick={props.onClick} ref={props.intersectionRef}>
                  <CardActionArea style={{ width: '100%', height: '100%' }} component='div'>
                    {
                      ImageRender
                    }
                    {
                      Loading
                    }
                  </CardActionArea>
                </Card>
                : null
            }
            {
              props.card !== true && props.cardActionArea !== true ?
                <div style={{ position: 'relative', ...props.style }} onClick={props.onClick} ref={props.intersectionRef}>
                  {
                    ImageRender
                  }
                  {
                    Loading
                  }
                </div>
                : null
            }
          </>
          : null
      }

      {
        props.cihldren !== undefined ? props.cihldren : null
      }
    </>

  return Component
}

function Image(props) {
  const cihldren = props.cihldren
  const src = props.src
  const mode = props.mode
  const lazy = props.lazy
  const card = props.card
  const cardActionArea = props.cardActionArea
  const loadingSize = props.loadingSize

  const onClick = props.onClick
  const onCallbackSize = props.onCallbackSize

  const style = props.style
  const styleImageVisible = props.styleImageVisible
  const styleImageInvisible = props.styleImageInvisible
  const styleImageLoading = props.styleImageLoading
  const styleImageBroken = props.styleImageBroken
  const styleImageSuspense = props.styleImageSuspense

  const { imageSrc, imageSrcPrevious, loading, loadingSuccess, loadingFail, intersectionRef } = useLoadImage({ src: src, lazy: lazy, onCallbackSize: onCallbackSize })

  const Component =
    <>
      {
        (imageSrcPrevious !== undefined && loadingFail !== true) || (imageSrcPrevious === undefined && loadingSuccess === true) ? <ImageContent cihldren={cihldren} src={imageSrc || imageSrcPrevious} mode={mode} loading={loading} loadingSize={loadingSize} card={card} cardActionArea={cardActionArea} intersectionRef={intersectionRef} onClick={onClick} style={{ ...style, ...styleImageVisible }} /> : null
      }
      {
        loadingFail === true ? <ImageBroken mode={mode} style={{ ...style, ...styleImageInvisible, ...styleImageBroken }} /> : null
      }
      {
        loading === true && imageSrcPrevious === undefined ? <ImageLoading loadingSize={loadingSize} style={{ ...style, ...styleImageInvisible, ...styleImageLoading }} /> : null
      }
      {
        loading !== true && loadingSuccess !== true && loadingFail !== true && imageSrcPrevious === undefined ? <ImageSuspense intersectionRef={intersectionRef} style={{ ...style, ...styleImageInvisible, ...styleImageSuspense }} /> : null
      }
    </>

  return Component
}

export default Image

export { Image, ImageSuspense, ImageBroken, ImageLoading, ImageContent }