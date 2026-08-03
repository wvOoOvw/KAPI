import React from 'react'

const useState = () => {
  const [size, setSize] = React.useState()

  React.useEffect(() => {
    const resize = () => {
      setSize({ width: window.screen.width, height: window.screen.height })
    }

    resize()

    window.addEventListener('resize', resize)

    return () => window.removeEventListener('resize', resize)
  }, [])

  return { size }
}

const Resize = (props) => { const state = useState(props); return props.children(state); }

const useResize = (props) => { const state = useState(props); return state; }

export { Resize, useResize }