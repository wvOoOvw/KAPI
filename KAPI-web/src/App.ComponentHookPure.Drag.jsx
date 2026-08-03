import React from 'react'

const useState = (props) => {
  const [dragIng, setDragIng] = React.useState(false)

  const positionOrigin = React.useRef()
  const positionTarget = React.useRef()

  const caculate = (e) => {
    var x
    var y
    var xs
    var ys
    var device

    if (e.pageX) x = e.pageX
    if (e.pageY) y = e.pageY

    if (e.changedTouches) xs = [...e.changedTouches].map(i => i.pageX)
    if (e.changedTouches) ys = [...e.changedTouches].map(i => i.pageY)

    if (window.ontouchstart === undefined) device = 'mouse'
    if (window.ontouchstart !== undefined) device = 'touch'

    if (x === undefined && xs === undefined) return
    if (y === undefined && ys === undefined) return

    if (x === undefined) x = xs[0]
    if (y === undefined) y = ys[0]

    if (xs === undefined) xs = [x]
    if (ys === undefined) ys = [y]

    return { x, y, xs, ys, device }
  }

  const onStart = React.useCallback((e) => {
    if (props.enable === false) return

    setDragIng(true)

    const { x, y, xs, ys, device } = caculate(e)

    positionOrigin.current = { x, y }
    positionTarget.current = { x, y }

    const changedX = 0
    const changedY = 0
    const continuedX = 0
    const continuedY = 0

    if (props.onChange) props.onChange({ status: 'afterStart', e, x, y, changedX, changedY, continuedX, continuedY })
  }, [props.enable, props.onChange])

  const onMove = React.useCallback((e) => {
    if (props.enable === false) return

    if (positionTarget.current === undefined) return

    const { x, y, xs, ys, device } = caculate(e)

    const changedX = x - positionTarget.current.x
    const changedY = y - positionTarget.current.y
    const continuedX = positionTarget.current.x - positionOrigin.current.x
    const continuedY = positionTarget.current.y - positionOrigin.current.y

    positionTarget.current = { x, y }

    if (props.onChange) props.onChange({ status: 'afterMove', e, x, y, changedX, changedY, continuedX, continuedY })
  }, [props.enable, props.onChange])

  const onEnd = React.useCallback((e) => {
    if (props.enable === false) return

    if (positionTarget.current === undefined) return

    setDragIng(false)

    const { x, y, xs, ys, device } = caculate(e)

    const changedX = x - positionTarget.current.x
    const changedY = y - positionTarget.current.y
    const continuedX = positionTarget.current.x - positionOrigin.current.x
    const continuedY = positionTarget.current.y - positionOrigin.current.y

    if (props.onChange) props.onChange({ status: 'beforeEnd', e, x, y, changedX, changedY, continuedX, continuedY })

    positionOrigin.current = undefined
    positionTarget.current = undefined

    if (props.onChange) props.onChange({ status: 'afterEnd', e, x, y, changedX, changedY, continuedX, continuedY })
  }, [props.enable, props.onChange])

  return { dragIng, onStart, onMove, onEnd }
}

const Drag = (props) => { const state = useState(props); return props.children(state); }

const useDrag = (props) => { const state = useState(props); return state; }

export { Drag, useDrag }