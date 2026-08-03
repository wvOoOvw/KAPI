const fs = require('fs')

const target_path = '/Users/magneto/Desktop/Code/kapi-static/src/_'
const target_path_result = '/Users/magneto/Desktop/Code/kapi-static/src/_image'

const exists = fs.existsSync(target_path_result)

if (!exists) fs.mkdirSync(target_path_result)

const removeExtra7zDir = async () => {
  const dirs = fs.readdirSync(target_path).filter(i => fs.statSync(target_path + '/' + i).isDirectory() && !i.includes('.DS_Store'))

  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i]

    fs.mkdirSync(target_path_result + '/' + dir)

    const files = fs.readdirSync(target_path + '/' + dir).filter(i => fs.statSync(target_path + '/' + dir + '/' + i).isFile() && !i.includes('.DS_Store'))

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      const read = fs.readFileSync(target_path + '/' + dir + '/' + file).toString()

      if (read.includes('data:image/jpeg;base64,')) {
        const imageBuffer = Buffer.from(read.replace('data:image/jpeg;base64,', ''), 'base64')

        fs.writeFileSync(target_path_result + '/' + dir + '/' + file.replace('.txt', '.jpg'), imageBuffer)
      }
    }

    console.log(dir)
  }
}

removeExtra7zDir()