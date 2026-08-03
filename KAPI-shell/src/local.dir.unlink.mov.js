const fs = require('fs')
const path = require('path')

const target_path = '/Users/magneto/Downloads/素材'

const removeMov = () => {
  fs.readdirSync(target_path).filter(i => fs.statSync(target_path + '/' + i).isDirectory() === true)
    .forEach(i => {
      fs.readdirSync(target_path + '/' + i)
        .forEach(i_ => {
          if (i_.includes('.mp4') || i_.includes('.mov')) fs.unlinkSync(target_path + '/' + i + '/' + i_)
        })
    })
}

removeMov()