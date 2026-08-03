const fs = require('fs')
const path = require('path')

const json = require('./crawler.skrbt.json')

const result = []

json.forEach(i => {
  i.extraContent = i.extraContent.map(i => {
    return {
      ...i,
      files: i.files.filter((i, index) => index < 10).map(i => {
        return {
          ...i,
          name: i.name
          .replace(/av/gi, '**')
          .replace(/[奸淫荡裸乳精液]/gi, '*')
          .replace(/[中出]/gi, '**')
          .replace(/会所/gi, '**')
        }
      })
    }
  })

  result.push(i)
})

fs.writeFileSync(path.resolve(__dirname, './crawler.skrbt.filter.json'), JSON.stringify(result))