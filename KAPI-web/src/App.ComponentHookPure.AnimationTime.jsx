import React from 'react'

const useState = (props) => {
  const [style, setStyle] = React.useState(props.animation[0])

  React.useEffect(() => setTimeout(() => setStyle(props.animation[1]), props.time), [])

  return { style }
}

const AnimationTime = (props) => { const state = useState(props); return props.children(state); }

const useAnimationTime = (props) => { const state = useState(props); return state; }

export { AnimationTime, useAnimationTime }