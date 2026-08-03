const fs = require('fs')
const path = require('path')

const target_path = '/Users/magneto/Downloads/网盘预览'

const renameFileMongo = () => {

  fs.readdirSync(target_path).filter(i => fs.statSync(target_path + '/' + i).isDirectory() === true)
    .forEach(i => {
      try {
        const name = i.replace('【', '').replace('】', ' ').replace(/No\.\d+/, '').replace(/NO\.\d+/, '').replace('  ', ' ')

        const files = fs.readdirSync(target_path + '/' + i).filter(i => !i.includes('.DS_Store'))

        var index = 1

        var post = false

        files.forEach((file) => {
          if (file !== 'F.jpg' && file.endsWith('.jpg')) {
            fs.renameSync(target_path + '/' + i + '/' + file, target_path + '/' + i + '/' + String(index).padStart(3, '0') + '.jpg')
            index = index + 1
          }
          if (file !== 'F.png' && file.endsWith('.png')) {
            fs.renameSync(target_path + '/' + i + '/' + file, target_path + '/' + i + '/' + String(index).padStart(3, '0') + '.jpg')
            index = index + 1
          }
          if ((file === 'F.jpg' || file === 'f.jpg') && file.endsWith('.jpg')) {
            fs.renameSync(target_path + '/' + i + '/' + file, target_path + '/' + i + '/' + 'F' + '.jpg')
            post = true
          }
          if ((file === 'F.png' || file === 'f.png') && file.endsWith('.png')) {
            fs.renameSync(target_path + '/' + i + '/' + file, target_path + '/' + i + '/' + 'F' + '.jpg')
            post = true
          }
        })

        fs.renameSync(target_path + '/' + i, target_path + '/' + name)

        if (files.length > 0 && post === false) {
          console.log('EMPTY', i)
        }
      } catch (err) {
        console.log(err)
      }
    })
}

renameFileMongo()