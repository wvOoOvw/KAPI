const fs = require('fs')

const target_path = '/Users/magneto/Desktop/Code/kapi-static/src/_'
const target_path_result = '/Users/magneto/Desktop/Code/kapi-static/src/_base64'

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

      const read = fs.readFileSync(target_path + '/' + dir + '/' + file)

      fs.writeFileSync(target_path_result + '/' + dir + '/' + file.replace('.jpg', '.txt'), `data:image/jpeg;base64,${read.toString('base64')}`)
    }

    console.log(dir)
  }
}

removeExtra7zDir()