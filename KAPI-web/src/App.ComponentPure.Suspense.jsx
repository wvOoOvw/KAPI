import React from 'react'

import { Context as ContextApp } from './App'

function SuspenseFallback(props) {
  const contextApp = React.useContext(ContextApp)

  React.useEffect(() => {
    contextApp.loadingArrayAction.add(props.name)
    return () => {
      contextApp.loadingArrayAction.remove(props.name)
    }
  }, [])

  return null
}

function Suspense(props) {
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    if (props.open) setLoaded(true)
  }, [props.open])

  const Component =
    <>
      {
        loaded ?
          <React.Suspense fallback={<SuspenseFallback name={props.name} />}>
            {props.children}
          </React.Suspense>
          : null
      }
    </>

  return Component
}

export { SuspenseFallback, Suspense }