const fs = require('fs')
const path = require('path')
const express = require('express')
const compression = require('compression')
const http = require('http')
// const https = require('https')

const app = express()

app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: false }))

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

  if ((origin && whiteOrigin.some(i => origin.startsWith(i)) === false) || (referer && whiteOrigin.some(i => referer.startsWith(i)) === false)) {
    return res.status(403).send()
  }

  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  res.header("Access-Control-Allow-Methods", "*")

  next()
});

app.use('/', require('./router.api'))

app.use(express.static('build'))
app.use(express.static('public'))

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'))
});

http.createServer(app).listen(process.argv.find(i => i.startsWith('--port'))?.replace('--port=', '') || 80)

// const ssl = {
//      key: fs.readFileSync(path.resolve(__dirname, '../static/ssl.key')),
//      cert: fs.readFileSync(path.resolve(__dirname, '../static/ssl.crt')),
//      rejectUnauthorized: false,
// }

// https.createServer(ssl, app).listen(443)