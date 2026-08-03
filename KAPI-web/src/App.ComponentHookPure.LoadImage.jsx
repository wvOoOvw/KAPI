import React from 'react'

import { Fetch, urlDecode } from './utils.fetch'

const useState = (props) => {
  const [imageSrc, setImageSrc] = React.useState()
  const [imageSrcPrevious, setImageSrcPrevious] = React.useState()
  const [loading, setLoading] = React.useState(false)
  const [loadingSuccess, setLoadingSuccess] = React.useState(false)
  const [loadingFail, setLoadingFail] = React.useState(false)

  const [shouldLoadCount, setShouldLoadCount] = React.useState(performance.now())

  const intersectionRef = React.useRef()

  const load = () => {
    setLoading(true)
    setLoadingSuccess(false)
    setLoadingFail(false)

    const src = props.src

    if (src && typeof src === 'string' && (src.startsWith('data:image') || src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png') || src.endsWith('.gif'))) {

      const image = new Image()

      image.onload = () => {
        setLoading(false)
        setLoadingSuccess(true)
        setImageSrc(src)

        if (props.onCallbackSize) props.onCallbackSize({ width: image.width, height: image.height })
      }

      image.onerror = () => {
        setLoading(false)
        setLoadingFail(true)
      }

      image.src = src
    }

    if (src && typeof src === 'string' && (src.endsWith('.base64') || src.endsWith('.txt'))) {
      Fetch.textUnauth(src)
        .then(res => {
          const image = new Image()

          image.onload = () => {
            setLoading(false)
            setLoadingSuccess(true)
            setImageSrc(res)

            if (props.onCallbackSize) props.onCallbackSize({ width: image.width, height: image.height })
          }

          image.onerror = () => {
            setLoading(false)
            setLoadingFail(true)
          }

          image.src = res
        })
        .catch(() => {
          setLoading(false)
          setLoadingFail(true)
        })
    }

    if (Boolean(src) === false) {
      setLoading(false)
      setLoadingFail(true)
    }
  }

  React.useEffect(() => {
    if (props.lazy !== true) {
      load()
    }

    if (props.lazy === true && intersectionRef.current) {
      const observer = new IntersectionObserver(en => {
        if (en[0].intersectionRatio > 0 && imageSrc === undefined) load()
      })

      observer.observe(intersectionRef.current)

      return () => observer.disconnect()
    }
  }, [shouldLoadCount])

  React.useEffect(() => {
    setImageSrc()
    setImageSrcPrevious(imageSrc)
    setShouldLoadCount(performance.now())
  }, [props.lazy, props.src])

  return { imageSrc, imageSrcPrevious, loading, loadingSuccess, loadingFail, intersectionRef }
}

const LoadImage = (props) => { const state = useState(props); return props.children(state); }

const useLoadImage = (props) => { const state = useState(props); return state; }

export { LoadImage, useLoadImage }