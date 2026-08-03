const fs = require('fs')
const path = require('path')

const origin_path = path.resolve(__dirname, './src')
const target_path = path.resolve(__dirname, './build')

const mimeType = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.mov': 'video/mov',
}

if (fs.existsSync(target_path)) fs.rmSync(target_path, { recursive: true, force: true })

fs.mkdirSync(target_path, { recursive: true })

function processDir(origin, target) {
  const dirs = fs.readdirSync(origin).filter(i => !i.includes('.DS_Store'))

  dirs.forEach(dir => {
    const origin_path = path.join(origin, dir)
    const target_path = path.join(target, dir)
    const stat = fs.statSync(origin_path)

    if (stat.isDirectory()) {
      fs.mkdirSync(target_path, { recursive: true })
      processDir(origin_path, target_path)
    }
    if (stat.isFile()) {
      const read = fs.readFileSync(origin_path)
      const ext = path.extname(dir).toLowerCase()
      fs.writeFileSync(target_path + '.base64', `data:${mimeType[ext]};base64,${read.toString('base64')}`)
    }
  })
}

processDir(origin_path, target_path)