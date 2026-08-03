const fs = require('fs')

const target_path = '/Users/magneto/Downloads/网盘'

// const target_path = '/Volumes/TOSHIBA EXT/VIDEO_PERFECT'

const search = () => {
  fs.readdirSync(target_path).filter(i => !i.includes('.DS_Store') && !i.includes('._'))
    .forEach(file => {
      var size = fs.statSync(target_path + '/' + '/' + file).size

      sizeResult = size

      if (size >= (1024 ** 2)) {
        sizeResult = (size / (1024 ** 2)).toFixed(2) + 'MB'
      }

      if (size >= (1024 ** 3)) {
        sizeResult = (size / (1024 ** 3)).toFixed(2) + 'GB'
      }

      console.log(`${file} @@@ ${sizeResult}`)
    })
}

search()