const express = require('express')
const compression = require('compression')
const formidable = require('formidable')
const http = require('http')
const path = require('path')
const fs = require('fs')

const app = express()

app.use(compression())
// app.use(express.json({ limit: '10mb' }))
// app.use(express.urlencoded({ limit: '10mb', extended: false }))

app.use((req, res, next) => {
  const origin = req.headers.origin || req.headers.Origin
  const referer = req.headers.referer || req.headers.Referer

  const whiteOrigin = [
    'http://localhost',
    'http://localhost:8000',
    'http://kapikapi.site',
    'http://kapikapiovo.xyz',
    'http://kapikapiart.online',
    'http://kapikapiart.site',
    'http://kapikapiart.shop',
    'http://kapikapiart.store',
  ]

  if ((origin && whiteOrigin.some(i => origin.includes(i)) === false) || (referer && whiteOrigin.some(i => referer.includes(i)) === false)) {
    return res.status(403).send()
  }

  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  res.header("Access-Control-Allow-Methods", "*")

  next()
})

app.post('/api/upload', async (req, res) => {
  try {
    const form = new formidable.IncomingForm()
    const data = await form.parse(req)

    const dir = data[0].dir[0]
    const file = data[1].file[0]

    if (dir.includes('../')) throw { error: new Error(), data: { code: 500 } }

    const dirComplete = path.join(__dirname, '../public', dir)
    const dirCompleteMk = dirComplete.split('/').filter((i, index) => index !== dirComplete.split('/').length - 1).join('/')
    const exist = fs.existsSync(dirComplete)

    if (exist === true) fs.unlinkSync(file.filepath)

    fs.mkdirSync(dirCompleteMk, { recursive: true })
    fs.renameSync(file.filepath, dirComplete)
    await new Promise(resolve => setTimeout(resolve, 1000))
    res.send({ code: 200, data: dir })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message })
  }
})

app.use(express.static('public'))

http.createServer(app).listen(process.argv.find(i => i.startsWith('--port'))?.replace('--port=', '') || 80)