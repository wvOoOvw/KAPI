const fs = require('fs')
const path = require('path')

const { Mongo, parseFind, ObjectId } = require('../../src/utils.mongo')

const dirname = path.resolve(__dirname, './src')

const dirs = fs.readdirSync(dirname)

Mongo.client.db('KAPIKAPI').collection('Album').find({}, { projection: { _id: 1 } }).toArray().then(res => {
  res.forEach(i => {
    const id = String(i._id)

    const findDir = dirs.find(n => n === id)

    if (findDir) {
      const files = fs.readdirSync(dirname + '/' + id)

      var poster = []
      var preivew = []

      files.filter(i => i.endsWith('.txt')).forEach(i => {
        if (i === 'F.txt') poster.push(`kapi://remote.oss/static/album/${id}/${i}`)
        if (i !== 'F.txt') preivew.push(`kapi://remote.oss/static/album/${id}/${i}`)
      })

      Mongo.client.db('KAPIKAPI').collection('Album').updateOne({ _id: i._id }, { $set: { poster: poster, preview: preivew } }).then(res => console.log('updateOne' + i._id))
    }
  })
})