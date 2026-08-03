import React from 'react'

const useState = (props) => {
  const ref = React.useRef()

  const [animationed, setAnimationed] = React.useState(false)
  const [style, setStyle] = React.useState(props.animation ? props.animation[0] : undefined)

  React.useEffect(() => {
    ref.current = requestAnimationFrame(() => {
      setAnimationed(true)
      setStyle(props.animation ? props.animation[1] : undefined)
    })

    return () => cancelAnimationFrame(ref.current)
  }, [])

  return { animationed, style }
}

const AnimationRAF = (props) => { const state = useState(props); return props.children(state); }

const useAnimationRAF = (props) => { const state = useState(props); return state; }

export { AnimationRAF, useAnimationRAF }