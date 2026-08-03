const fs = require('fs')
const path = require('path')

const target_path = '/Users/magneto/Downloads/网盘上传'

const removeExtra7z = () => {
  fs.readdirSync(target_path).filter(i => i.includes('.zip') || i.includes('.7z'))
    .forEach(i => {
      fs.renameSync(
        target_path + '/' + i,
        target_path + '/' + i + '.kapi'
      )
    })
}

removeExtra7z()