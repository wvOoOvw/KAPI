import React from 'react'

const useState = (props) => {
  const [scrollIng, setScrollIng] = React.useState(false)
  const [scrollTop, setScrollTop] = React.useState(0)

  const ref = React.useRef()

  React.useEffect(() => {
    const scroll = (e) => {
      setScrollIng(true)
      setScrollTop(e.target.scrollingElement.scrollTop)
      clearTimeout(ref.current)
      ref.current = setTimeout(() => setScrollIng(false), props.time)
    }

    window.addEventListener('scroll', scroll)

    return () => window.removeEventListener('scroll', scroll)
  }, [])

  return { scrollIng, scrollTop }
}

const Scroll = (props) => { const state = useState(props); return props.children(state); }

const useScroll = (props) => { const state = useState(props); return state; }

export { Scroll, useScroll }