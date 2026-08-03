import React from 'react'
import * as ReactRouterDom from "react-router-dom"

import { Suspense } from './App.ComponentPure.Suspense'

import { Context as ContextApp } from './App'

const Coin = React.lazy(() => import('./App.Dialogs.Coin'))
const Code = React.lazy(() => import('./App.Dialogs.Code'))
const Decode = React.lazy(() => import('./App.Dialogs.Decode'))
const DecodeGuide = React.lazy(() => import('./App.Dialogs.DecodeGuide'))

const AlbumFilter = React.lazy(() => import('./App.Dialogs.AlbumFilter'))
const AlbumInformationOperation = React.lazy(() => import('./App.Dialogs.AlbumInformationOperation'))

const CartoonFilter = React.lazy(() => import('./App.Dialogs.CartoonFilter'))
const CartoonInformationOperation = React.lazy(() => import('./App.Dialogs.CartoonInformationOperation'))

const UserLogin = React.lazy(() => import('./App.Dialogs.UserLogin'))
const UserRegister = React.lazy(() => import('./App.Dialogs.UserRegister'))
const UserInformationOperation = React.lazy(() => import('./App.Dialogs.UserInformationOperation'))

const Contact = React.lazy(() => import('./App.Dialogs.Contact'))
const ContactChat = React.lazy(() => import('./App.Dialogs.ContactChat'))

const ImageView = React.lazy(() => import('./App.Dialogs.Global.ImageView'))
const Confirm = React.lazy(() => import('./App.Dialogs.Global.Confirm'))

const PublishPick = React.lazy(() => import('./App.Dialogs.PublishPick'))
const SystemPick = React.lazy(() => import('./App.Dialogs.SystemPick'))

function App() {
  const pathname = ReactRouterDom.useLocation().pathname

  const contextApp = React.useContext(ContextApp)

  React.useEffect(() => { contextApp.setDialogsArray([]) }, [pathname])

  const Component =
    <>
      <Suspense name='Dialogs' open={contextApp.dialogsArrayAction.exist('AlbumFilter')}><AlbumFilter /></Suspense>
      <Suspense name='Dialogs' open={contextApp.dialogsArrayAction.exist('AlbumInformationOperation')}><AlbumInformationOperation /></Suspense>

      <Suspense name='Dialogs' open={contextApp.dialogsArrayAction.exist('CartoonFilter')}><CartoonFilter /></Suspense>
      <Suspense name='Dialogs' open={contextApp.dialogsArrayAction.exist('CartoonInformationOperation')}><CartoonInformationOperation /></Suspense>

      <Suspense name='Dialogs' open={contextApp.dialogsArrayAction.exist('Coin')}><Coin /></Suspense>
      <Suspense name='Dialogs' open={contextApp.dialogsArrayAction.exist('Code')}><Code /></Suspense>
      <Suspense name='Dialogs' open={contextApp.dialogsArrayAction.exist('Decode')}><Decode /></Suspense>
      <Suspense name='Dialogs' open={contextApp.dialogsArrayAction.exist('DecodeGuide')}><DecodeGuide /></Suspense>

      <Suspense name='Dialogs' open={contextApp.dialogsArrayAction.exist('UserLogin')}><UserLogin /></Suspense>
      <Suspense name='Dialogs' open={contextApp.dialogsArrayAction.exist('UserRegister')}><UserRegister /></Suspense>
      <Suspense name='Dialogs' open={contextApp.dialogsArrayAction.exist('UserInformationOperation')}><UserInformationOperation /></Suspense>

      <Suspense name='Dialogs' open={contextApp.dialogsArrayAction.exist('Contact')}><Contact /></Suspense>
      <Suspense name='Dialogs' open={contextApp.dialogsArrayAction.exist('ContactChat')}><ContactChat /></Suspense>

      <Suspense name='Dialogs' open={contextApp.dialogsArrayAction.exist('ImageView')}><ImageView /></Suspense>
      <Suspense name='Dialogs' open={contextApp.dialogsArrayAction.exist('Confirm')}><Confirm /></Suspense>

      <Suspense name='Dialogs' open={contextApp.dialogsArrayAction.exist('PublishPick')}><PublishPick /></Suspense>
      <Suspense name='Dialogs' open={contextApp.dialogsArrayAction.exist('SystemPick')}><SystemPick /></Suspense>
    </>

  return Component
}

export default App