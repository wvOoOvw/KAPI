const fs = require('fs')
const path = require('path')

const json = require('./ku138.crawler.json')

const result = []

json.forEach(i => {
  if (result.every(n => n.hash !== i.hash)) result.push(i)
})

fs.writeFileSync(path.resolve(__dirname, './ku138.crawler.filter.json'), JSON.stringify(result))