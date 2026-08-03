const fs = require('fs')

const target_path = '/Users/magneto/Downloads/网盘'

const search = () => {
  fs.readdirSync(target_path).filter(i => fs.statSync(target_path + '/' + i).isDirectory() === true)
    .forEach(collection => {
      var count = {}
      var size = 0

      const name = collection.match(/【.+】/)[0].replace('【', '').replace('】', '')

      fs.readdirSync(target_path + '/' + collection).filter(i => !i.includes('.DS_Store'))
        .forEach(file => {
          const type = file.split('.').pop()
          if (count[type] !== undefined) count[type] = count[type] + 1
          if (count[type] === undefined) count[type] = 1
          size = size + fs.statSync(target_path + '/' + collection + '/' + file).size
        })

      const countP = (count.jpg || 0) + (count.png || 0)
      const countV = (count.mp4 || 0) + (count.mov || 0)
      const countT = (countP ? `${countP}P` : '') + (countP && countV ? ' + ' : '') + (countV ? `${countV}V` : '')

      var sizeT = (size / (1024 ** 1)).toFixed(2) + 'KB'

      if (size >= (1024 ** 2)) {
        sizeT = (size / (1024 ** 2)).toFixed(2) + 'MB'
      }

      if (size >= (1024 ** 3)) {
        sizeT = (size / (1024 ** 3)).toFixed(2) + 'GB'
      }

      console.log(`${name} @@@ ${collection} @@@ ${countT} @@@ ${sizeT}`)
    })
}

search()