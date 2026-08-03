import React from 'react'
import * as ReactActivation from "react-activation"

const useState = () => {
  const [active, setActive] = React.useState(true)

  ReactActivation.useActivate(() => setActive(true))
  ReactActivation.useUnactivate(() => setActive(false))

  return { active }
}

const Activation = (props) => { const state = useState(props); return props.children(state); }

const useActivation = (props) => { const state = useState(props); return state; }

export { Activation, useActivation }