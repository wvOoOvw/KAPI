import React from 'react'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import { Context as ContextApp } from './App'

import ContactWXMP_1 from '../static/image/ContactWXMP_1.jpg'
import ContactQQ_2 from '../static/image/ContactQQ_2.jpg'

function App() {
  const contextApp = React.useContext(ContextApp)

  const [tab, setTab] = React.useState(0)

  React.useEffect(() => {
    if (contextApp.dialogsArrayAction.exist('Contact')) {
      setTab(contextApp.dialogsArrayAction.props('Contact')?.defaultTab || 0)
    }
  }, [contextApp.dialogsArrayAction.exist('Contact')])

  const Component =
    <Dialog open={contextApp.dialogsArrayAction.exist('Contact')} onClose={() => contextApp.dialogsArrayAction.remove('Contact')} sx={{ '& .MuiDialog-paper': { width: 600, maxWidth: 'unset' } }}>
      <DialogTitle>
        <Typography color='primary' style={{ fontSize: 20 }}>联系客服</Typography>
      </DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 12 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} style={{ minHeight: 'auto', flexShrink: 0 }}>
          <Tab value={0} label='公众号' style={{ minWidth: 'unset', minHeight: 32, padding: '4px 16px', fontSize: 14 }} />
          <Tab value={1} label='QQ' style={{ minWidth: 'unset', minHeight: 32, padding: '4px 16px', fontSize: 14 }} />
        </Tabs>
        {
          tab === 0 ? <img src={ContactWXMP_1} style={{ width: '80%', maxWidth: 320, margin: 'auto' }} /> : null
        }
        {
          tab === 1 ? <img src={ContactQQ_2} style={{ width: '80%', maxWidth: 320, margin: 'auto' }} /> : null
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={() => contextApp.dialogsArrayAction.remove('Contact')}>我知道了</Button>
      </DialogActions>
    </Dialog>

  return Component
}

export default App