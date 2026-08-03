const fs = require('fs')
const path = require('path')

const target_path = '/Users/magneto/Desktop/Code/kapi-static/src/_'

function deleteFolderRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(dirPath)
  }
}

const removeExtra7zDir = async () => {
  const dirs = fs.readdirSync(target_path).filter(i => fs.statSync(target_path + '/' + i).isDirectory() && !i.includes('.DS_Store'))

  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i]

    const files = fs.readdirSync(target_path + '/' + dir).filter(i => fs.statSync(target_path + '/' + dir + '/' + i).isFile() && !i.includes('.DS_Store'))

    const read = fs.readFileSync(target_path + '/' + dir + '/' + files[0]).toString()

    if (!read.includes('data:image/jpeg;base64,')) {
      deleteFolderRecursive(target_path + '/' + dir)
    }
  }
}

removeExtra7zDir()