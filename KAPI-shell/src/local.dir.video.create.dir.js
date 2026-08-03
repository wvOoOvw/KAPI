const fs = require('fs')

const target_path = '/Users/magneto/Downloads/Player Poster'

const run = async () => {
  const files = fs.readdirSync(target_path).filter(i => !i.includes('.DS_Store'))

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    fs.mkdirSync(target_path + '/' + file.split('_')[0])
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    fs.renameSync(target_path + '/' + file, target_path + '/' + file.split('_')[0] + '/' + 'F.jpg')
  }
}

run()