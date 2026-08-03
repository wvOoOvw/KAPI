const fs = require('fs')
const path = require('path')

const target_path = '/Users/magneto/Downloads/网盘/【七七娜娜子】 NO.007 碧蓝航线 光荣新春 自拍'

const removeExtra7zDir = () => {
  fs.readdirSync(target_path).filter(i => !i.includes('.DS_Store'))
    .forEach(dir => {
      fs.readdirSync(target_path + '/' + dir).filter(i => !i.includes('.DS_Store'))
        .forEach(file => {
          fs.renameSync(
            target_path + '/' + dir + '/' + file,
            target_path + '/' + dir + '/' + 'zp' + file
          )
        })
    })
}

removeExtra7zDir()