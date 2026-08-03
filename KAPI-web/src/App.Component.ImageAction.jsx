import React from 'react'

import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Typography from '@mui/material/Typography'

import DeleteIcon from '@mui/icons-material/Delete'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'

import Image from './App.ComponentPure.Image'

import { Context as ContextApp } from './App'

import { upload } from './utils.upload'

export default function ImageAction(props) {
  const value = props.value
  const onChange = props.onChange

  const contextApp = React.useContext(ContextApp)

  const onAppend = async (e) => {
    contextApp.loadingArrayAction.add('Upload')

    for (const file of e.target.files) {
      await upload(file, 'album')
        .then(res => {
          onChange([...value, res.data])
        })
        .catch(res => {
          contextApp.messageArrayAction.add(res?.message || '上传失败')
        })
    }

    contextApp.loadingArrayAction.remove('Upload')
  }

  const onDelete = i => {
    onChange(value.filter((n) => n !== i))
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {
        value.map((i) => {
          return <Paper key={i} style={{ width: 120, minWidth: 120, maxWidth: 'calc(50% - 12px)', aspectRatio: '1 / 1', borderRadius: 8, overflow: 'hidden', flexGrow: 0, flexShrink: 0, position: 'relative' }}>
            <Image
              lazy
              cardActionArea
              src={i}
              mode='BackgroundCover'
              loadingSize={32}
              style={{ width: '100%', height: '100%' }}
              onClick={() => contextApp.dialogsArrayAction.add('ImageView', { image: i })}
            />
            <Button variant='contained' style={{ minWidth: 'unset', padding: 4, backdropFilter: 'blur(4px)', background: 'rgba(0, 0, 0, 0.2)', position: 'absolute', top: 8, right: 8 }} onClick={() => onDelete(i)}><DeleteIcon /></Button>
          </Paper>
        })
      }
      <label style={{ width: 120, minWidth: 120, maxWidth: 'calc(50% - 12px)', aspectRatio: '1 / 1', borderRadius: 8, overflow: 'hidden', flexGrow: 0, flexShrink: 0, position: 'relative' }}>
        <input type='file' accept='image/*' multiple style={{ display: 'none' }} onChange={onAppend} />
        <Card style={{ width: '100%', height: '100%', border: '2px dashed gray', boxShadow: 'none' }}>
          <CardActionArea style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8 }} component='div'>
            <Typography variant='body2' style={{ fontSize: 12, opacity: 0.5 }}>上传图片</Typography>
            <AddAPhotoIcon style={{ width: 20, height: 20, opacity: 0.5 }} />
          </CardActionArea>
        </Card>
      </label>
    </div>
  )
}