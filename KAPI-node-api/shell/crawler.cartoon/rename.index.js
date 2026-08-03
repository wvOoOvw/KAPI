const fs = require('fs')
const path = require('path')

const target_path = path.resolve(__dirname, './build')

const dirs = fs.readdirSync(target_path).filter(i => fs.statSync(target_path + '/' + i).isDirectory() === true)

dirs.forEach(dir => {
  const map = {}
  fs.readdirSync(target_path + '/' + dir)
    .filter(file => fs.statSync(target_path + '/' + dir + '/' + file).isDirectory() === false)
    .filter(file => file.endsWith('.DS_Store') === false)
    .forEach(file => {
      var extra = file.slice(file.lastIndexOf('.') + 1).toLowerCase()
      if (extra === 'jpeg') extra = 'jpg'
      if (map[extra] === undefined) map[extra] = 1
      fs.renameSync(
        target_path + '/' + dir + '/' + file,
        target_path + '/' + dir + '/' + '___' + map[extra].toString().padStart(3, '0') + '.' + extra,
      )
      map[extra] = map[extra] + 1
    })

  fs.readdirSync(target_path + '/' + dir)
    .filter(file => fs.statSync(target_path + '/' + dir + '/' + file).isDirectory() === false)
    .filter(file => file.endsWith('.DS_Store') === false)
    .forEach(file => {
      fs.renameSync(
        target_path + '/' + dir + '/' + file,
        target_path + '/' + dir + '/' + file.replace('___', ''),
      )
    })
})