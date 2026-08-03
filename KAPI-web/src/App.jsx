import React from 'react'
import * as ReactRouterDom from "react-router-dom"
import * as ReactActivation from "react-activation"

import { ThemeProvider, createTheme } from '@mui/material/styles'

import Loading from './App.Module.Loading'
import Message from './App.Module.Message'
import Dialogs from './App.Module.Dialogs'
import Content from './App.Module.Content'
import Navigation from './App.Module.Navigation'

import { Fetch } from './utils.fetch'

const Context = React.createContext()

function App() {
  const [theme, setTheme] = React.useState({
    palette: {
      primary: {
        main: 'rgba(218, 122, 133, 1)'
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ theme, ownerState }) => {
            return {
              ...(ownerState.variant === 'contained' && ownerState.color === 'primary' ? { color: 'rgba(255, 255, 255, 1)' } : {}),
            }
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: ({ theme, ownerState }) => {
            return {
              ...(ownerState.color === 'primary' ? { color: 'rgba(255, 255, 255, 1)' } : {}),
            }
          },
        },
      },
      MuiPagination: {
        styleOverrides: {
          root: ({ theme, ownerState }) => {
            console.log(ownerState)
            return {
              ...(
                ownerState.color === 'primary' ? {
                  '& .MuiPaginationItem-root.Mui-selected': { color: 'rgba(255, 255, 255, 1)' }
                } : {}
              ),
            }
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: ({ theme, ownerState }) => {
            return {
              ...{
                '& input': {
                  // ...(ownerState.color === 'primary' ? { color: 'rgba(218, 122, 133, 1)' } : {}),
                  // ...(ownerState.size === 'small' ? { fontSize: '16px' } : {})
                },
                '& textarea': {
                  // ...(ownerState.color === 'primary' ? { color: 'rgba(218, 122, 133, 1)' } : {}),
                  // ...(ownerState.size === 'small' ? { fontSize: '16px' } : {})
                },
                '& label': {
                  // ...(ownerState.color === 'primary' ? { color: 'rgba(218, 122, 133, 1)' } : {}),
                  // ...(ownerState.size === 'small' ? { fontSize: '14px' } : {})
                },
                '& .MuiInputLabel-shrink': {
                  // ...(ownerState.color === 'primary' ? { color: 'rgba(218, 122, 133, 1)' } : {}),
                  // ...(ownerState.size === 'small' ? { fontSize: '14px' } : {})
                },
                '& .MuiInputBase-root fieldset legend': {
                  // ...(ownerState.color === 'primary' ? { color: 'rgba(218, 122, 133, 1)' } : {}),
                  // ...(ownerState.size === 'small' ? { fontSize: '10px' } : {})
                },
              },
            }
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          root: {
            '& .MuiDialog-paper': { width: 720, maxWidth: 'unset' }
          },
        },
      },
      MuiStepper: {
        styleOverrides: {
          root: {
            '& .MuiStepLabel-iconContainer text': { fill: 'rgba(255, 255, 255, 1)' },
            '& .MuiStepLabel-iconContainer circle': { fill: 'rgba(218, 122, 133, 0.5)' },
            '& .MuiStepLabel-iconContainer.Mui-active text': { fill: 'rgba(255, 255, 255, 1)' },
            '& .MuiStepLabel-iconContainer.Mui-active circle': { fill: 'rgba(218, 122, 133, 1)' }
          },
        },
      }
    },
  })

  const [loadingArray, setLoadingArray] = React.useState([])
  const [messageArray, setMessageArray] = React.useState([])
  const [dialogsArray, setDialogsArray] = React.useState([])

  const [user, setUser] = React.useState()
  const [userConnected, setUserConnected] = React.useState(false)

  const loadingArrayAdd = (name) => {
    setLoadingArray(i => [...i, { name: name }])
  }

  const loadingArrayRemove = (name) => {
    setLoadingArray(i => i.filter(i => i.name !== name))
  }

  const messageArrayAdd = (message) => {
    setMessageArray(i => [...i, { key: performance.now(), message: message }])
  }

  const dialogsArrayAdd = async (name, props) => {
    const exist = dialogsArray.some(i => i.name === name)

    if (exist === true) {
      setLoadingArray(i => [...i, { name: 'DialogRepeat' }])
      setDialogsArray(i => i.filter(i => i.name !== name))
      await new Promise(r => setTimeout(r, 1000))
      setDialogsArray(i => [...i, { name: name, props: props }])
      setLoadingArray(i => i.filter(i => i.name !== 'DialogRepeat'))
    }

    if (exist !== true) {
      setDialogsArray(i => [...i, { name: name, props: props }])
    }
  }

  const dialogsArrayRemove = (name) => {
    setDialogsArray(i => i.filter(i => i.name !== name))
  }

  const dialogsArrayExist = (name) => {
    return dialogsArray.some(i => i.name === name)
  }

  const dialogsArrayProps = (name) => {
    return dialogsArrayExist(name) ? dialogsArray.find(i => i.name === name).props : undefined
  }

  const loadingArrayAction = { add: (...props) => loadingArrayAdd(...props) || loadingArrayAction, remove: (...props) => loadingArrayRemove(...props) || loadingArrayAction }
  const messageArrayAction = { add: (...props) => messageArrayAdd(...props) || messageArrayAction }
  const dialogsArrayAction = { add: (...props) => dialogsArrayAdd(...props) || dialogsArrayAction, remove: (...props) => dialogsArrayRemove(...props) || dialogsArrayAction, exist: (...props) => dialogsArrayExist(...props), props: (...props) => dialogsArrayProps(...props) }
  const loadingArrayCollection = (name) => ({ add: (...props) => loadingArrayAdd(name, ...props) || loadingArrayCollection(name), remove: (...props) => loadingArrayRemove(name, ...props) || loadingArrayCollection(name) })
  const messageArrayCollection = (name) => ({ add: (...props) => messageArrayAdd(name, ...props) || messageArrayCollection(name) })
  const dialogsArrayCollection = (name) => ({ add: (...props) => dialogsArrayAdd(name, ...props) || dialogsArrayCollection(name), remove: (...props) => dialogsArrayRemove(name, ...props) || dialogsArrayCollection(name), exist: (...props) => dialogsArrayExist(name, ...props), props: (...props) => dialogsArrayProps(name, ...props) })

  const onFetchUserConnect = async () => {
    await Fetch.json('/api/app/user/find/login/authorization')
      .then(res => {
        setUser(res.data)
        localStorage.setItem('User_Authorization', res.data.authorization)
      })
      .catch(res => {
        localStorage.removeItem('User_Authorization')
      })
  }

  const onInit = async () => {
    if (localStorage.getItem('User_Authorization')) await onFetchUserConnect()
    setUserConnected(true)
  }

  // FIX

  React.useEffect(() => {
    if (localStorage.getItem('USER_TOKEN')) {
      localStorage.setItem('User_Authorization', localStorage.getItem('USER_TOKEN'))
      localStorage.removeItem('USER_TOKEN')
    }
  }, [])

  // FIX - END

  React.useEffect(() => {
    Fetch.connect(user?.authorization || localStorage.getItem('User_Authorization') || '')
  }, [user])

  React.useEffect(() => { onInit() }, [])

  const contextProvider = {}

  Object.assign(contextProvider, { theme, setTheme })
  Object.assign(contextProvider, { loadingArray, setLoadingArray, messageArray, setMessageArray, dialogsArray, setDialogsArray })
  Object.assign(contextProvider, { loadingArrayAdd, loadingArrayRemove, messageArrayAdd, dialogsArrayAdd, dialogsArrayRemove })
  Object.assign(contextProvider, { loadingArrayAction, messageArrayAction, dialogsArrayAction })
  Object.assign(contextProvider, { loadingArrayCollection, messageArrayCollection, dialogsArrayCollection })
  Object.assign(contextProvider, { user, setUser })

  const Component =
    <Context.Provider value={contextProvider}>
      <ThemeProvider theme={createTheme(theme)}>
        <ReactActivation.AliveScope>
          <ReactRouterDom.BrowserRouter>
            <Loading />
            <Message />
            {
              userConnected === true ?
                <>
                  <Dialogs />
                  <Content />
                  <Navigation />
                </>
                : null
            }
          </ReactRouterDom.BrowserRouter>
        </ReactActivation.AliveScope>
      </ThemeProvider>
    </Context.Provider>

  return Component
}

export default App

export { Context }