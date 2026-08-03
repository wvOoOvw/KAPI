const fs = require('fs')

const target_path = '/Users/magneto/Desktop/Code/kapi-static/src/album-origin'

const oversize = async () => {
  const dirs = fs.readdirSync(target_path).filter(i => fs.statSync(target_path + '/' + i).isDirectory() && !i.includes('.DS_Store'))

  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i]

    const files = fs.readdirSync(target_path + '/' + dir).filter(i => fs.statSync(target_path + '/' + dir + '/' + i).isFile() && !i.includes('.DS_Store'))

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      const size = fs.statSync(target_path + '/' + dir + '/' + file).size

      if (size > 1024 * 300) {
        console.log(dir)
      }
    }
  }
}

oversize()