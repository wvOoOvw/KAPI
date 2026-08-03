const fs = require('fs')
const path = require('path')

const origin_path = path.resolve(__dirname, './src')
const target_path = path.resolve(__dirname, './build')

const mimeTypeToExt = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'video/mp4': '.mp4',
  'video/mov': '.mov',
}

if (fs.existsSync(target_path)) fs.rmSync(target_path, { recursive: true, force: true })

fs.mkdirSync(target_path)

function processDir(origin, target) {
  const dirs = fs.readdirSync(origin).filter(i => !i.includes('.DS_Store'))

  dirs.forEach(dir => {
    const origin_pash = path.join(origin, dir)
    const target_path = path.join(target, dir)
    const stat = fs.statSync(origin_pash)

    if (stat.isDirectory()) {
      fs.mkdirSync(target_path, { recursive: true })
      processDir(origin_pash, target_path)
    }
    if (stat.isFile()) {
      const read = fs.readFileSync(origin_pash).toString()

      let ext = ''
      let base64Data = read

      Object.entries(mimeTypeToExt).entries(entries => {
        const mime = entries[0]
        const extension = entries[1]

        const prefix = `data:${mime};base64,`
        if (read.includes(prefix)) {
          base64Data = read.replace(prefix, '')
          ext = extension
        }
      })

      const fileBuffer = Buffer.from(base64Data, 'base64')
      const outputPath = target_path.replace('.base64', '') + ext
      fs.writeFileSync(outputPath, fileBuffer)
    }
  })
}

processDir(origin_path, target_path)